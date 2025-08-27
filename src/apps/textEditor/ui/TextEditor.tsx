import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import styles from './textEditor.module.css';
import { systemApi } from '../../../index';

interface FileEditorProps {
  filePath: string;
}

class EditorErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Monaco Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#1e1e1e',
          color: '#fff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h3>📝 Editor Error</h3>
          <p>Monaco Editor encountered an error and will reload:</p>
          <code style={{ color: '#ff6b6b', marginBottom: '10px' }}>
            {this.state.error?.message || 'Unknown error'}
          </code>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            style={{
              padding: '8px 16px',
              background: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Reload Editor
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const safeEditorOperation = (operation: () => any, fallback?: any) => {
  try {
    return operation();
  } catch (error) {
    console.warn('Safe editor operation failed:', error);
    return fallback;
  }
};

// eslint-disable-next-line react/display-name
const TextEditor: React.FC<FileEditorProps> = React.memo(({ filePath }) => {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editorReady, setEditorReady] = useState(false);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const [editorKey, setEditorKey] = useState(0);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const isDisposedRef = useRef(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const getLanguage = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext'
    };
    return langMap[ext || ''] || 'plaintext';
  };

  const loadFile = async () => {
    try {
      setLoading(true);
      const fileContent = await systemApi.fileSystem.readFile(filePath);
      setContent(fileContent);
      contentRef.current = fileContent;
    } catch (error) {
      console.error('Error loading file:', error);
      setContent('');
      contentRef.current = '';
    } finally {
      setLoading(false);
    }
  };

  const saveFile = useCallback(async () => {
    const currentContent = contentRef.current;
    if (currentContent === null || currentContent === undefined) return;

    try {
      await systemApi.fileSystem.writeFile(filePath, currentContent);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }, [filePath]);

  const handleChange = useCallback((value: string | undefined) => {
    if (isDisposedRef.current) return;

    const newValue = value ?? '';
    const currentContent = contentRef.current;

    if (newValue !== currentContent) {
      setContent(newValue);
      contentRef.current = newValue;
      setIsDirty(true);
    }
  }, []);

  const getEditorValue = useCallback(() => {
    return safeEditorOperation(() => {
      if (!editorRef.current || isDisposedRef.current) return contentRef.current;

      const model = editorRef.current.getModel();
      if (!model) return contentRef.current;

      return model.getValue();
    }, contentRef.current);
  }, []);

  const safeLayout = useCallback(() => {
    safeEditorOperation(() => {
      if (editorRef.current && !isDisposedRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          editorRef.current.layout();
        }
      }
    });
  }, []);

  const handleWindowFocus = useCallback(() => {
    setIsWindowActive(true);
    setTimeout(() => {
      safeLayout();
    }, 100);
  }, [safeLayout]);

  const handleWindowBlur = useCallback(() => {
    setIsWindowActive(false);

    const currentValue = getEditorValue();
    if (currentValue !== contentRef.current) {
      setContent(currentValue);
      contentRef.current = currentValue;
      setIsDirty(true);
    }
  }, [getEditorValue]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const currentValue = getEditorValue();
      if (currentValue !== contentRef.current) {
        setContent(currentValue);
        contentRef.current = currentValue;
      }
      saveFile();
    }
  }, [saveFile, getEditorValue]);

  const reloadEditor = useCallback(() => {
    setEditorReady(false);
    isDisposedRef.current = true;

    if (editorRef.current) {
      safeEditorOperation(() => {
        editorRef.current.dispose();
      });
    }

    editorRef.current = null;
    setEditorKey(prev => prev + 1);

    setTimeout(() => {
      isDisposedRef.current = false;
    }, 100);
  }, []);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorReady(true);
    isDisposedRef.current = false;

    const disposables: any[] = [];

    try {
      const onChangeDisposable = editor.onDidChangeModelContent(() => {
        if (isDisposedRef.current) return;

        safeEditorOperation(() => {
          const model = editor.getModel();
          if (model) {
            const value = model.getValue();
            handleChange(value);
          }
        });
      });
      disposables.push(onChangeDisposable);

      const onModelChangeDisposable = editor.onDidChangeModel(() => {
        if (isDisposedRef.current) return;

        safeEditorOperation(() => {
          const model = editor.getModel();
          if (model) {
            const value = model.getValue();
            if (value !== contentRef.current) {
              setContent(value);
              contentRef.current = value;
            }
          }
        });
      });
      disposables.push(onModelChangeDisposable);

      const resizeObserver = new ResizeObserver(() => {
        if (!isDisposedRef.current) {
          safeLayout();
        }
      });

      const container = editor.getContainerDomNode()?.parentElement;
      if (container) {
        resizeObserver.observe(container);
      }

      return () => {
        disposables.forEach(d => {
          try {
            d.dispose();
          } catch (error) {
            console.warn('Error disposing editor event:', error);
          }
        });

        resizeObserver.disconnect();
        isDisposedRef.current = true;
      };
    } catch (error) {
      console.error('Error setting up editor:', error);
      reloadEditor();
    }
  }, [handleChange, safeLayout, reloadEditor]);

  const handleEditorValidation = useCallback((markers: any[]) => {
    if (isDisposedRef.current) return;

    const errors = markers.filter(m => m.severity === 8);
    if (errors.length > 0) {
      console.warn('Editor validation errors:', errors);
    }
  }, []);

  useEffect(() => {
    loadFile();
  }, [filePath]);

  useEffect(() => {
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('keydown', handleKeyDown);

      isDisposedRef.current = true;
      if (editorRef.current) {
        safeEditorOperation(() => {
          editorRef.current.dispose();
        });
      }
    };
  }, [handleWindowFocus, handleWindowBlur, handleKeyDown]);

  useEffect(() => {
    if (!isWindowActive && isDirty) {
      const autoSaveTimer = setTimeout(() => {
        saveFile();
      }, 1000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [isWindowActive, isDirty, saveFile]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <EditorErrorBoundary>
      <div className={styles.editor}>
        <div className={styles.toolbar}>
          <span className={styles.filename}>
            {filePath.split('/').pop()}
            {isDirty && ' *'}
            {!isWindowActive && ' (background)'}
          </span>
          <div className={styles.actions}>
            <button onClick={saveFile} disabled={!isDirty || !editorReady}>
              Save {isDirty && !isWindowActive ? '(auto)' : ''}
            </button>
            <button onClick={reloadEditor} style={{ marginLeft: '8px', fontSize: '12px' }}>
              🔄 Reload
            </button>
          </div>
        </div>

        <div style={{
          height: 'calc(100% - 40px)',
          opacity: isWindowActive ? 1 : 0.7,
          transition: 'opacity 0.2s ease'
        }}>
          <Editor
            key={editorKey}
            height="100%"
            language={getLanguage(filePath)}
            value={content}
            onChange={handleChange}
            onMount={handleEditorDidMount}
            onValidate={handleEditorValidation}
            theme="vs-dark"
            loading={<div>Initializing Monaco Editor...</div>}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              readOnly: !isWindowActive,
              quickSuggestions: {
                other: isWindowActive,
                comments: isWindowActive,
                strings: isWindowActive
              },
              suggestOnTriggerCharacters: isWindowActive,
              acceptSuggestionOnEnter: isWindowActive ? 'on' : 'off',
              tabCompletion: isWindowActive ? 'on' : 'off',
              wordBasedSuggestions: isWindowActive ? 'matchingDocuments' : 'off',
              folding: false,
              lightbulb: { enabled: false },
              codeLens: false
            }}
          />
        </div>
      </div>
    </EditorErrorBoundary>
  );
});

export { TextEditor };