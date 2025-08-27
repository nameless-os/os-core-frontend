import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faEdit,
  faFile,
  faFolder,
  faHome,
  faPlus,
  faRefresh,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { systemApi } from '../../../index';
import { FileEntry, getErrorMessage, Nullable } from '@nameless-os/sdk';
import { fileRegistry } from '../../../api/app/fileAssociations';
import styles from './fileExplorer.module.css';

interface UploadProgressItem {
  loaded: number;
  total: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const FileExplorer = () => {
  console.log('Styles object:', styles);
  const [currentPath, setCurrentPath] = useState('/home');
  const [items, setItems] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [history, setHistory] = useState(['/home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<null | {
    x: number;
    y: number;
    item: Nullable<FileEntry>;
  }>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newItemType, setNewItemType] = useState('file');
  const [newItemName, setNewItemName] = useState('');
  const [renameItem, setRenameItem] = useState<Nullable<FileEntry & { newName: string }>>(null);
  const [theme, setTheme] = useState('darkTheme');
  const [dragOverlay, setDragOverlay] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});

  const fileInputRef = useRef(null);

  const loadDirectory = useCallback(async (path: string) => {
    if (!systemApi.fileSystem) {
      setError('File system not available');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const files = await systemApi.fileSystem.readDir(path);
      setItems(files);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to load directory');
    } finally {
      setLoading(false);
    }
  }, [systemApi.fileSystem]);

  const refresh = () => {
    loadDirectory(currentPath);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverlay(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.relatedTarget instanceof Node && !e.currentTarget.contains(e.relatedTarget)) {
      setDragOverlay(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverlay(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (!systemApi.fileSystem) {
      setError('File system not available');
      return;
    }

    const initialProgress: Record<string, UploadProgressItem> = {};
    files.forEach(file => {
      initialProgress[file.name] = { loaded: 0, total: file.size, status: 'uploading' };
    });
    setUploadProgress(initialProgress);

    try {
      await Promise.all(files.map(async (file) => {
        const fullPath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const textContent = new TextDecoder().decode(uint8Array);

        try {
          await systemApi.fileSystem.writeFile(fullPath, textContent);

          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'completed' },
          }));
        } catch (err) {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'error', error: getErrorMessage(err) },
          }));
          throw err;
        }
      }));

      refresh();

      setTimeout(() => setUploadProgress({}), 2000);
    } catch (err) {
      setError(`Upload failed: ${getErrorMessage(err)}`);
      setTimeout(() => setUploadProgress({}), 5000);
    }
  }, [currentPath, systemApi.fileSystem, refresh]);

  const navigateTo = useCallback((path: string) => {
    if (path !== currentPath) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(path);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPath(path);
    }
  }, [currentPath, history, historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goUp = () => {
    if (currentPath !== '/') {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      navigateTo(parentPath);
    }
  };

  const goHome = () => {
    navigateTo('/home');
  };

  const handleItemDoubleClick = (item: FileEntry) => {
    if (item.stats.isDirectory) {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigateTo(newPath);
      return;
    }

    const appId = fileRegistry.getDefaultAppForFile(item.name);
    if (appId) {
      const fullPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      systemApi.app.startApp(appId, { filePath: fullPath });
    } else {
      setError(`No app registered for file type: ${item.name}`);
    }
  };

  const handleItemClick = (item: FileEntry, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(item.name)) {
        newSelected.delete(item.name);
      } else {
        newSelected.add(item.name);
      }
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(new Set([item.name]));
    }
  };

  const handleContextMenu = (event: React.MouseEvent, item: Nullable<FileEntry>) => {
    event.preventDefault();
    if (item && !selectedItems.has(item.name)) {
      setSelectedItems(new Set([item.name]));
    }
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      item: item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: number) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleNewItem = async () => {
    if (!newItemName.trim() || !systemApi.fileSystem) return;

    const fullPath = currentPath === '/' ? `/${newItemName}` : `${currentPath}/${newItemName}`;

    try {
      if (newItemType === 'folder') {
        await systemApi.fileSystem.mkdir(fullPath);
      } else {
        await systemApi.fileSystem.writeFile(fullPath, '');
      }
      refresh();
      setShowNewDialog(false);
      setNewItemName('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (selectedItems.size === 0 || !systemApi.fileSystem) return;

    try {
      for (const itemName of selectedItems) {
        const fullPath = currentPath === '/' ? `/${itemName}` : `${currentPath}/${itemName}`;
        const item = items.find(i => i.name === itemName);
        await systemApi.fileSystem.delete(fullPath, { recursive: item?.stats.isDirectory });
      }
      setSelectedItems(new Set());
      refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
    closeContextMenu();
  };

  const handleRename = (item: FileEntry) => {
    setRenameItem({ ...item, newName: item.name });
    closeContextMenu();
  };

  const confirmRename = async () => {
    if (!renameItem || !renameItem.newName.trim() || !systemApi.fileSystem) return;

    const oldPath = currentPath === '/' ? `/${renameItem.name}` : `${currentPath}/${renameItem.name}`;
    const newPath = currentPath === '/' ? `/${renameItem.newName}` : `${currentPath}/${renameItem.newName}`;

    try {
      await systemApi.fileSystem.move(oldPath, newPath);
      refresh();
      setRenameItem(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath, loadDirectory]);

  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const DragDropOverlay = () => {
    if (!dragOverlay) return null;

    return (
      <div className={styles.dragDropOverlay}>
        <div className={styles.dragDropContent}>
          <div className={styles.dragDropIcon}>📁</div>
          <div className={styles.dragDropText}>Drop files here to upload</div>
          <div className={styles.dragDropSubtext}>Files will be uploaded to {currentPath}</div>
        </div>
      </div>
    );
  };

  const getFileIcon = (fileName: string): Nullable<string> => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) {
      return null;
    }

    const supportedExtensions: Record<string, string> = {
      'js': 'js',
      'ts': 'ts',
      'jsx': 'js',
      'tsx': 'ts',

      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'svg': 'image',
      'bmp': 'image',
      'ico': 'image',
      'webp': 'image',
      'tiff': 'image',
      'psd': 'image',

      'mp4': 'video',
      'avi': 'video',
      'mkv': 'video',
      'mov': 'video',
      'wmv': 'video',
      'flv': 'video',
      'webm': 'video',
      'm4v': 'video',
      'mpg': 'video',
      'mpeg': 'video',
    };

    if (supportedExtensions[extension]) {
      return `assets/images/fileExt/${supportedExtensions[extension]}.svg`;
    }

    return null;
  };

  const FileIcon: FC<{
    fileName: string;
    isDirectory: boolean;
  }> = ({ fileName, isDirectory }) => {
    if (isDirectory) {
      return <FontAwesomeIcon icon={faFolder} className={`${styles.fileIcon} ${styles.folder}`}/>;
    }

    const customIconPath = getFileIcon(fileName);

    if (customIconPath) {
      return (
        <img
          src={customIconPath}
          alt={fileName}
          className={`${styles.fileIcon} ${styles.customIcon}`}
          onError={(e) => {
            const target = e.target as HTMLElement;
            const sibling = target.nextSibling as HTMLElement;

            target.style.display = 'none';
            sibling.style.display = 'inline';
          }}
        />
      );
    }

    return <FontAwesomeIcon icon={faFile} className={`${styles.fileIcon} ${styles.file}`}/>;
  };

  const UploadProgress = () => {
    const uploads = Object.entries(uploadProgress);
    if (uploads.length === 0) return null;

    return (
      <div className={styles.uploadProgress}>
        <div className={styles.uploadHeader}>
          <span>Uploading files...</span>
          <button
            onClick={() => setUploadProgress({})}
            className={styles.uploadClose}
          >
            ×
          </button>
        </div>
        {uploads.map(([fileName, progress]) => (
          <div key={fileName} className={styles.uploadItem}>
            <div className={styles.uploadInfo}>
              <span className={styles.uploadName}>{fileName}</span>
              <span className={`${styles.uploadStatus} ${styles[progress.status]}`}>
              {progress.status === 'uploading' && '⏳'}
                {progress.status === 'completed' && '✅'}
                {progress.status === 'error' && '❌'}
            </span>
            </div>
            {progress.status === 'error' && (
              <div className={styles.uploadError}>{progress.error}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.fileExplorer} ${styles[theme]}`}>
      <div className={styles.toolbar}>
        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={goBack}
            disabled={historyIndex === 0}
            title="Back"
          >
            <FontAwesomeIcon icon={faArrowLeft}/>
          </button>
          <button
            className={styles.navBtn}
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            title="Forward"
          >
            <FontAwesomeIcon icon={faArrowRight}/>
          </button>
          <button
            className={styles.navBtn}
            onClick={goUp}
            disabled={currentPath === '/'}
            title="Up"
          >
            <FontAwesomeIcon icon={faArrowUp}/>
          </button>
          <button className={styles.navBtn} onClick={goHome} title="Home">
            <FontAwesomeIcon icon={faHome}/>
          </button>
          <button className={styles.navBtn} onClick={refresh} title="Refresh">
            <FontAwesomeIcon icon={faRefresh}/>
          </button>
        </div>
        <div className={styles.addressBar}>
          <input
            type="text"
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateTo((e.target as HTMLInputElement).value);
              }
            }}
            className={styles.pathInput}
          />
        </div>
        <div className={styles.actionButtons}>
          <button
            className={styles.actionBtn}
            onClick={() => setShowNewDialog(true)}
            title="New"
          >
            <FontAwesomeIcon icon={faPlus}/>
          </button>
          <button
            className={styles.actionBtn}
            onClick={handleDelete}
            disabled={selectedItems.size === 0}
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash}/>
          </button>
        </div>
      </div>
      {error && (
        <div className={`${styles.statusBar} ${styles.error}`}>
          <span>Error: {error}</span>
          <button onClick={() => setError('')} className={styles.closeError}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        </div>
      )}
      <div
        className={styles.fileListContainer}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div
            className={styles.fileList}
            onContextMenu={(e) => handleContextMenu(e, null)}
          >
            <div className={styles.fileListHeader}>
              <div className={styles.headerName}>Name</div>
              <div className={styles.headerSize}>Size</div>
              <div className={styles.headerDate}>Modified</div>
            </div>
            {items.map((item, index) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div
                key={`${item.name}-${index}`}
                className={`${styles.fileItem} ${selectedItems.has(item.name) ? styles.selected : ''}`}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <div className={styles.itemName}>
                  <FileIcon fileName={item.name} isDirectory={item.stats.isDirectory}/>
                  <span className={styles.itemText}>{item.name}</span>
                </div>
                <div className={styles.itemSize}>
                  {item.stats.isDirectory ? '' : formatFileSize(item.stats.size)}
                </div>
                <div className={styles.itemDate}>
                  {formatDate(+item.stats.modified)}
                </div>
              </div>
            ))}
          </div>
        )}
        <DragDropOverlay/>
        <UploadProgress/>
      </div>
      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            position: 'fixed',
            zIndex: 1000,
          }}
        >
          {contextMenu.item && (
            <>
              <button className={styles.contextItem} onClick={() => handleRename(contextMenu.item!)}>
                <FontAwesomeIcon icon={faEdit}/> Rename
              </button>
              <button className={styles.contextItem} onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash}/> Delete
              </button>
              <div className={styles.contextSeparator}></div>
            </>
          )}
          <button className={styles.contextItem} onClick={() => {
            setShowNewDialog(true);
            setNewItemType('file');
            closeContextMenu();
          }}>
            <FontAwesomeIcon icon={faFile}/> New File
          </button>
          <button className={styles.contextItem} onClick={() => {
            setShowNewDialog(true);
            setNewItemType('folder');
            closeContextMenu();
          }}>
            <FontAwesomeIcon icon={faFolder}/> New Folder
          </button>
        </div>
      )}
      {showNewDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <div className={styles.dialogHeader}>
              <h3>Create New {newItemType === 'folder' ? 'Folder' : 'File'}</h3>
              <button onClick={() => setShowNewDialog(false)} className={styles.dialogClose}>
                <FontAwesomeIcon icon={faTimes}/>
              </button>
            </div>
            <div className={styles.dialogBody}>
              <div className={styles.formGroup}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>Type:</label>
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>Name:</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewItem()}
                  className={styles.formInput}
                  placeholder={`Enter ${newItemType} name`}
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.dialogFooter}>
              <button onClick={() => setShowNewDialog(false)} className={styles.btnCancel}>
                Cancel
              </button>
              <button onClick={handleNewItem} className={styles.btnCreate} disabled={!newItemName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {renameItem && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <div className={styles.dialogHeader}>
              <h3>Rename Item</h3>
              <button onClick={() => setRenameItem(null)} className={styles.dialogClose}>
                <FontAwesomeIcon icon={faTimes}/>
              </button>
            </div>
            <div className={styles.dialogBody}>
              <div className={styles.formGroup}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>New name:</label>
                <input
                  type="text"
                  value={renameItem.newName}
                  onChange={(e) => setRenameItem({ ...renameItem, newName: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                  className={styles.formInput}
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.dialogFooter}>
              <button onClick={() => setRenameItem(null)} className={styles.btnCancel}>
                Cancel
              </button>
              <button onClick={confirmRename} className={styles.btnCreate} disabled={!renameItem.newName?.trim()}>
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FileExplorer };