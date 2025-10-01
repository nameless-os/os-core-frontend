import { useCallback, useEffect, useState, FC, useRef, useMemo } from 'react';
import { systemApi } from '../../../index';
import { FileEntry, getErrorMessage, Nullable } from '@nameless-os/sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faFile, faFolder, faTrash, faCopy, faCut, faPaste,
  faRefresh, faTimes, faArrowLeft, faArrowRight, faArrowUp, faHome,
  faPlus, faChevronUp, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import styles from './fileExplorer.module.css';
import { fileRegistry } from '../../../api/app/fileAssociations';

export type SortField = 'name' | 'size' | 'modified';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface UploadProgressItem {
  loaded: number;
  total: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FileDragData {
  filePath: string;
  name: string;
  isDirectory: boolean;
}

export interface ClipboardItem {
  name: string;
  fullPath: string;
  isDirectory: boolean;
  operation: 'copy' | 'cut';
}

export const useSorting = (items: FileEntry[], resetOnPathChange: boolean = true) => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    direction: 'asc'
  });

  const toggleSort = useCallback((field: SortField) => {
    setSortState(prevState => ({
      field,
      direction: prevState.field === field && prevState.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const resetSort = useCallback(() => {
    setSortState({
      field: 'name',
      direction: 'asc'
    });
  }, []);

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      // Папки всегда сначала
      if (a.stats.isDirectory && !b.stats.isDirectory) return -1;
      if (!a.stats.isDirectory && b.stats.isDirectory) return 1;

      let comparison = 0;

      switch (sortState.field) {
        case 'name':
          comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          break;
        case 'size':
          if (!a.stats.isDirectory && !b.stats.isDirectory) {
            comparison = a.stats.size - b.stats.size;
          } else {
            comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          }
          break;
        case 'modified':
          comparison = (+a.stats.modified) - (+b.stats.modified);
          break;
        default:
          comparison = 0;
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortState]);

  return {
    sortState,
    sortedItems,
    toggleSort,
    resetSort
  };
};

// Хук для работы с файловой системой
export const useFileSystem = (currentPath: string) => {
  const [items, setItems] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  }, []);

  const refresh = useCallback(() => {
    loadDirectory(currentPath);
  }, [currentPath, loadDirectory]);

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath, loadDirectory]);

  return { items, loading, error, setError, refresh };
};

// Хук для работы с буфером обмена
export const useClipboard = (currentPath: string, items: FileEntry[], selectedItems: Set<string>) => {
  const [clipboard, setClipboard] = useState<ClipboardItem[]>([]);

  const copyToClipboard = useCallback(() => {
    const selectedFiles = Array.from(selectedItems).map(name => {
      const item = items.find(i => i.name === name);
      if (!item) return null;

      const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
      return {
        name,
        fullPath,
        isDirectory: item.stats.isDirectory,
        operation: 'copy' as const,
      };
    }).filter(Boolean) as ClipboardItem[];

    setClipboard(selectedFiles);
  }, [selectedItems, items, currentPath]);

  const cutToClipboard = useCallback(() => {
    const selectedFiles = Array.from(selectedItems).map(name => {
      const item = items.find(i => i.name === name);
      if (!item) return null;

      const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
      return {
        name,
        fullPath,
        isDirectory: item.stats.isDirectory,
        operation: 'cut' as const,
      };
    }).filter(Boolean) as ClipboardItem[];

    setClipboard(selectedFiles);
  }, [selectedItems, items, currentPath]);

  const pasteFromClipboard = useCallback(async (): Promise<boolean> => {
    if (!clipboard.length || !systemApi.fileSystem) return false;

    try {
      for (const clipboardItem of clipboard) {
        const targetPath = currentPath === '/' ? `/${clipboardItem.name}` : `${currentPath}/${clipboardItem.name}`;

        if (clipboardItem.operation === 'copy') {
          if (clipboardItem.isDirectory) {
            await systemApi.fileSystem.copy(clipboardItem.fullPath, targetPath, { recursive: true });
          } else {
            await systemApi.fileSystem.copy(clipboardItem.fullPath, targetPath);
          }
        } else if (clipboardItem.operation === 'cut') {
          await systemApi.fileSystem.move(clipboardItem.fullPath, targetPath);
        }
      }

      if (clipboard.some(item => item.operation === 'cut')) {
        setClipboard([]);
      }

      return true;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }, [clipboard, currentPath]);

  return {
    clipboard,
    setClipboard,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
  };
};

// Хук для навигации
export const useNavigation = () => {
  const [currentPath, setCurrentPath] = useState('/home');
  const [history, setHistory] = useState(['/home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateTo = useCallback((path: string) => {
    if (path !== currentPath) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(path);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPath(path);
    }
  }, [currentPath, history, historyIndex]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  }, [historyIndex, history]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  }, [historyIndex, history]);

  const goUp = useCallback(() => {
    if (currentPath !== '/') {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      navigateTo(parentPath);
    }
  }, [currentPath, navigateTo]);

  const goHome = useCallback(() => {
    navigateTo('/home');
  }, [navigateTo]);

  return {
    currentPath,
    setCurrentPath,
    history,
    historyIndex,
    navigateTo,
    goBack,
    goForward,
    goUp,
    goHome,
  };
};

// Хук для горячих клавиш
export const useKeyboardShortcuts = (
  selectedItems: Set<string>,
  items: FileEntry[],
  copyToClipboard: () => void,
  cutToClipboard: () => void,
  pasteFromClipboard: () => Promise<boolean>,
  handleDelete: () => void,
  handleRename: (item: FileEntry) => void,
  closeContextMenu: () => void,
  setSelectedItems: (items: Set<string>) => void,
  clipboard: ClipboardItem[],
  refresh: () => void
) => {
  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd && e.key === 'c' && selectedItems.size > 0) {
      e.preventDefault();
      copyToClipboard();
    } else if (isCtrlOrCmd && e.key === 'x' && selectedItems.size > 0) {
      e.preventDefault();
      cutToClipboard();
    } else if (isCtrlOrCmd && e.key === 'v' && clipboard.length > 0) {
      e.preventDefault();
      try {
        const success = await pasteFromClipboard();
        if (success) refresh();
      } catch (err) {
        console.error('Paste failed:', err);
      }
    } else if (e.key === 'Delete' && selectedItems.size > 0) {
      e.preventDefault();
      handleDelete();
    } else if (e.key === 'F2' && selectedItems.size === 1) {
      e.preventDefault();
      const selectedItemName = Array.from(selectedItems)[0];
      const item = items.find(i => i.name === selectedItemName);
      if (item) handleRename(item);
    } else if (e.key === 'Escape') {
      setSelectedItems(new Set());
      closeContextMenu();
    }
  }, [
    selectedItems, clipboard, copyToClipboard, cutToClipboard,
    pasteFromClipboard, handleDelete, handleRename, closeContextMenu,
    setSelectedItems, items, refresh
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Утилиты
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatDate = (date: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getFileIcon = (fileName: string): string | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return null;

  const supportedExtensions: Record<string, string> = {
    'js': 'js', 'ts': 'ts', 'jsx': 'js', 'tsx': 'ts',
    'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image',
    'svg': 'image', 'bmp': 'image', 'ico': 'image', 'webp': 'image',
    'mp4': 'video', 'avi': 'video', 'mkv': 'video', 'mov': 'video',
  };

  return supportedExtensions[extension]
    ? `assets/images/fileExt/${supportedExtensions[extension]}.svg`
    : null;
};

const SortableHeader: FC<{
  sortState: SortState;
  onToggleSort: (field: SortField) => void;
}> = ({ sortState, onToggleSort }) => {
  const SortIcon: FC<{ field: SortField }> = ({ field }) => {
    if (sortState.field !== field) {
      return <span className={styles.sortIconPlaceholder}></span>;
    }

    return (
      <FontAwesomeIcon
        icon={sortState.direction === 'asc' ? faChevronUp : faChevronDown}
        className={styles.sortIcon}
      />
    );
  };

  return (
    <div className={styles.fileListHeader}>
      <button
        className={`${styles.headerButton} ${sortState.field === 'name' ? styles.activeSort : ''}`}
        onClick={() => onToggleSort('name')}
      >
        <span>Name</span>
        <SortIcon field="name" />
      </button>

      <button
        className={`${styles.headerButton} ${sortState.field === 'size' ? styles.activeSort : ''}`}
        onClick={() => onToggleSort('size')}
      >
        <span>Size</span>
        <SortIcon field="size" />
      </button>

      <button
        className={`${styles.headerButton} ${sortState.field === 'modified' ? styles.activeSort : ''}`}
        onClick={() => onToggleSort('modified')}
      >
        <span>Modified</span>
        <SortIcon field="modified" />
      </button>
    </div>
  );
};

export const FileIcon: FC<{
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
          const fallback = target.nextSibling as HTMLElement;
          target.style.display = 'none';
          if (fallback) fallback.style.display = 'inline';
        }}
      />
    );
  }

  return <FontAwesomeIcon icon={faFile} className={`${styles.fileIcon} ${styles.file}`}/>;
};

export const DragDropOverlay: FC<{
  dragOverlay: boolean;
  currentPath: string;
}> = ({ dragOverlay, currentPath }) => {
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

export const UploadProgress: FC<{
  uploadProgress: Record<string, UploadProgressItem>;
  onClose: () => void;
}> = ({ uploadProgress, onClose }) => {
  const uploads = Object.entries(uploadProgress);
  if (uploads.length === 0) return null;

  return (
    <div className={styles.uploadProgress}>
      <div className={styles.uploadHeader}>
        <span>Uploading files...</span>
        <button onClick={onClose} className={styles.uploadClose}>×</button>
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

export const ContextMenu: FC<{
  contextMenu: {
    x: number;
    y: number;
    item: Nullable<FileEntry>;
  } | null;
  selectedItems: Set<string>;
  clipboard: ClipboardItem[];
  onRename: (item: FileEntry) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRefresh: () => void;
}> = ({
        contextMenu, selectedItems, clipboard, onRename, onCopy, onCut,
        onPaste, onDelete, onNewFile, onNewFolder, onRefresh
      }) => {
  if (!contextMenu) return null;

  const hasSelection = selectedItems.size > 0;
  const canPaste = clipboard.length > 0;
  const selectedCount = selectedItems.size;

  return (
    <div
      className={styles.contextMenu}
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
        position: 'fixed',
        zIndex: 1000,
      }}
    >
      {contextMenu.item ? (
        <>
          {selectedCount === 1 && (
            <button className={styles.contextItem} onClick={() => onRename(contextMenu.item!)}>
              <FontAwesomeIcon icon={faEdit}/> Rename
            </button>
          )}
          <button className={styles.contextItem} onClick={onCopy}>
            <FontAwesomeIcon icon={faCopy}/>
            Copy {selectedCount > 1 ? `${selectedCount} items` : ''}
          </button>
          <button className={styles.contextItem} onClick={onCut}>
            <FontAwesomeIcon icon={faCut}/>
            Cut {selectedCount > 1 ? `${selectedCount} items` : ''}
          </button>
          {canPaste && contextMenu.item?.stats.isDirectory && (
            <>
              <div className={styles.contextSeparator}></div>
              <button className={styles.contextItem} onClick={onPaste}>
                <FontAwesomeIcon icon={faPaste}/>
                Paste {clipboard.length} item{clipboard.length > 1 ? 's' : ''}
              </button>
            </>
          )}
          <div className={styles.contextSeparator}></div>
          <button className={styles.contextItem} onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash}/>
            Delete {selectedCount > 1 ? `${selectedCount} items` : ''}
          </button>
        </>
      ) : (
        <>
          {canPaste && (
            <>
              <button className={styles.contextItem} onClick={onPaste}>
                <FontAwesomeIcon icon={faPaste}/>
                Paste {clipboard.length} item{clipboard.length > 1 ? 's' : ''}
              </button>
              <div className={styles.contextSeparator}></div>
            </>
          )}
          <button className={styles.contextItem} onClick={onNewFile}>
            <FontAwesomeIcon icon={faFile}/> New File
          </button>
          <button className={styles.contextItem} onClick={onNewFolder}>
            <FontAwesomeIcon icon={faFolder}/> New Folder
          </button>
          <div className={styles.contextSeparator}></div>
          <button className={styles.contextItem} onClick={onRefresh}>
            <FontAwesomeIcon icon={faRefresh}/> Refresh
          </button>
        </>
      )}
    </div>
  );
};

export const NewItemDialog: FC<{
  show: boolean;
  itemType: string;
  itemName: string;
  onTypeChange: (type: string) => void;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ show, itemType, itemName, onTypeChange, onNameChange, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3>Create New {itemType === 'folder' ? 'Folder' : 'File'}</h3>
          <button onClick={onCancel} className={styles.dialogClose}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        </div>
        <div className={styles.dialogBody}>
          <div className={styles.formGroup}>
            <label>Type:</label>
            <select
              value={itemType}
              onChange={(e) => onTypeChange(e.target.value)}
              className={styles.formSelect}
            >
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
              className={styles.formInput}
              placeholder={`Enter ${itemType} name`}
              autoFocus
            />
          </div>
        </div>
        <div className={styles.dialogFooter}>
          <button onClick={onCancel} className={styles.btnCancel}>Cancel</button>
          <button onClick={onConfirm} className={styles.btnCreate} disabled={!itemName.trim()}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export const RenameDialog: FC<{
  item: (FileEntry & { newName: string }) | null;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ item, onNameChange, onConfirm, onCancel }) => {
  if (!item) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3>Rename Item</h3>
          <button onClick={onCancel} className={styles.dialogClose}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        </div>
        <div className={styles.dialogBody}>
          <div className={styles.formGroup}>
            <label>New name:</label>
            <input
              type="text"
              value={item.newName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
              className={styles.formInput}
              autoFocus
            />
          </div>
        </div>
        <div className={styles.dialogFooter}>
          <button onClick={onCancel} className={styles.btnCancel}>Cancel</button>
          <button onClick={onConfirm} className={styles.btnCreate} disabled={!item.newName?.trim()}>
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

// Список файлов
export const FileList: FC<{
  items: FileEntry[];
  selectedItems: Set<string>;
  onItemClick: (item: FileEntry, event: React.MouseEvent) => void;
  onItemDoubleClick: (item: FileEntry) => void;
  onItemDragStart: (e: React.DragEvent, item: FileEntry) => void;
  onContextMenu: (event: React.MouseEvent, item: FileEntry) => void;
  onItemDrop: (e: React.DragEvent, item: FileEntry) => void;
  sortState: SortState;
  onToggleSort: (field: SortField) => void;
}> = ({ items, selectedItems, onItemClick, onItemDoubleClick, onItemDragStart, onContextMenu, sortState, onToggleSort }) => {
  return (
    <div className={styles.fileList}>
      <SortableHeader
        sortState={sortState}
        onToggleSort={onToggleSort}
      />
      {items.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className={`${styles.fileItem} ${selectedItems.has(item.name) ? styles.selected : ''}`}
          draggable={true}
          onDragStart={(e) => onItemDragStart(e, item)}
          onDragOver={(e) => {
            if (item.stats.isDirectory) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }
          }}
          onDrop={(e) => {
            if (item.stats.isDirectory) {
              e.preventDefault();
              e.stopPropagation();
              onItemDrop(e, item); // Новый обработчик
            }
          }}
          onClick={(e) => onItemClick(item, e)}
          onDoubleClick={() => onItemDoubleClick(item)}
          onContextMenu={(e) => {
            e.stopPropagation();
            onContextMenu(e, item);
          }}
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
  );
};

const FileExplorer = () => {
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [contextMenu, setContextMenu] = useState<null | {
    x: number;
    y: number;
    item: Nullable<FileEntry>;
  }>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newItemType, setNewItemType] = useState('file');
  const [newItemName, setNewItemName] = useState('');
  const [renameItem, setRenameItem] = useState<Nullable<FileEntry & { newName: string }>>(null);
  const [dragOverlay, setDragOverlay] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});

  // Используем кастомные хуки
  const navigation = useNavigation();
  const fileSystem = useFileSystem(navigation.currentPath);
  const clipboard = useClipboard(navigation.currentPath, fileSystem.items, selectedItems);

  const containerRef = useRef<HTMLDivElement>(null);

  // Обработчики файловых операций
  const handleNewItem = useCallback(async () => {
    if (!newItemName.trim() || !systemApi.fileSystem) return;

    const fullPath = navigation.currentPath === '/'
      ? `/${newItemName}`
      : `${navigation.currentPath}/${newItemName}`;

    try {
      if (newItemType === 'folder') {
        await systemApi.fileSystem.mkdir(fullPath);
      } else {
        await systemApi.fileSystem.writeFile(fullPath, '');
      }
      fileSystem.refresh();
      setShowNewDialog(false);
      setNewItemName('');
    } catch (err) {
      fileSystem.setError(getErrorMessage(err));
    }
  }, [newItemName, newItemType, navigation.currentPath, fileSystem]);

  const handleDelete = useCallback(async () => {
    if (selectedItems.size === 0 || !systemApi.fileSystem) return;

    try {
      for (const itemName of selectedItems) {
        const fullPath = navigation.currentPath === '/'
          ? `/${itemName}`
          : `${navigation.currentPath}/${itemName}`;
        const item = fileSystem.items.find(i => i.name === itemName);
        await systemApi.fileSystem.delete(fullPath, { recursive: item?.stats.isDirectory });
      }

      setSelectedItems(new Set());

      // Очищаем буфер от удаленных файлов
      const deletedPaths = Array.from(selectedItems).map(name =>
        navigation.currentPath === '/' ? `/${name}` : `${navigation.currentPath}/${name}`
      );

      const cutItems = clipboard.clipboard.filter(clipItem => clipItem.operation === 'cut');
      if (cutItems.some(cutItem => deletedPaths.includes(cutItem.fullPath))) {
        clipboard.setClipboard(clipboard.clipboard.filter(clipItem =>
          clipItem.operation === 'copy' || !deletedPaths.includes(clipItem.fullPath)
        ));
      }

      fileSystem.refresh();
    } catch (err) {
      fileSystem.setError(getErrorMessage(err));
    }
    setContextMenu(null);
  }, [selectedItems, navigation.currentPath, fileSystem, clipboard]);

  const handleRename = useCallback((item: FileEntry) => {
    setRenameItem({ ...item, newName: item.name });
    setContextMenu(null);
  }, []);

  const confirmRename = useCallback(async () => {
    if (!renameItem?.newName.trim() || !systemApi.fileSystem) return;

    const oldPath = navigation.currentPath === '/'
      ? `/${renameItem.name}`
      : `${navigation.currentPath}/${renameItem.name}`;
    const newPath = navigation.currentPath === '/'
      ? `/${renameItem.newName}`
      : `${navigation.currentPath}/${renameItem.newName}`;

    try {
      await systemApi.fileSystem.move(oldPath, newPath);

      // Обновляем буфер
      clipboard.setClipboard(prevClipboard =>
        prevClipboard.map(clipItem =>
          clipItem.fullPath === oldPath
            ? { ...clipItem, name: renameItem.newName, fullPath: newPath }
            : clipItem
        )
      );

      fileSystem.refresh();
      setRenameItem(null);
    } catch (err) {
      fileSystem.setError(getErrorMessage(err));
    }
  }, [renameItem, navigation.currentPath, fileSystem, clipboard]);

  // Обработчики взаимодействия с файлами
  const handleItemClick = useCallback((item: FileEntry, event: React.MouseEvent) => {
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
  }, [selectedItems]);

  const handleItemDoubleClick = useCallback((item: FileEntry) => {
    if (item.stats.isDirectory) {
      const newPath = navigation.currentPath === '/'
        ? `/${item.name}`
        : `${navigation.currentPath}/${item.name}`;
      navigation.navigateTo(newPath);
      return;
    }

    const appId = fileRegistry.getDefaultAppForFile(item.name);
    if (appId) {
      const fullPath = navigation.currentPath === '/'
        ? `/${item.name}`
        : `${navigation.currentPath}/${item.name}`;
      systemApi.app.startApp(appId, { filePath: fullPath });
    } else {
      fileSystem.setError(`No app registered for file type: ${item.name}`);
    }
  }, [navigation, fileSystem]);

  const handleContextMenu = useCallback((event: React.MouseEvent, item: Nullable<FileEntry>) => {
    event.preventDefault();

    // Сначала устанавливаем выбор, затем показываем меню
    if (item && !selectedItems.has(item.name)) {
      setSelectedItems(new Set([item.name]));
    }

    // Небольшая задержка чтобы selectedItems успел обновиться
    setTimeout(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      setContextMenu({
        x: event.clientX - (rect?.left || 0),
        y: event.clientY - (rect?.top || 0),
        item
      });
    }, 0);
  }, [selectedItems]);

  // Drag & Drop
  const handleItemDragStart = useCallback((e: React.DragEvent, item: FileEntry) => {
    const filePath = navigation.currentPath === '/'
      ? `/${item.name}`
      : `${navigation.currentPath}/${item.name}`;

    const dragData: FileDragData = {
      filePath, name: item.name, isDirectory: item.stats.isDirectory
    };

    e.dataTransfer.setData('application/file-shortcut', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  }, [navigation.currentPath]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverlay(false);

    const files = Array.from(e.dataTransfer.files);
    if (!files.length || !systemApi.fileSystem) return;

    const initialProgress: Record<string, UploadProgressItem> = {};
    files.forEach(file => {
      initialProgress[file.name] = { loaded: 0, total: file.size, status: 'uploading' };
    });
    setUploadProgress(initialProgress);

    try {
      await Promise.all(files.map(async (file) => {
        const fullPath = navigation.currentPath === '/'
          ? `/${file.name}`
          : `${navigation.currentPath}/${file.name}`;

        try {
          const arrayBuffer = await file.arrayBuffer();
          await systemApi.fileSystem.writeFile(fullPath, new Uint8Array(arrayBuffer));

          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'completed' }
          }));
        } catch (err) {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'error', error: getErrorMessage(err) }
          }));
        }
      }));

      fileSystem.refresh();
      setTimeout(() => setUploadProgress({}), 2000);
    } catch (err) {
      fileSystem.setError(`Upload failed: ${getErrorMessage(err)}`);
      setTimeout(() => setUploadProgress({}), 5000);
    }
  }, [navigation.currentPath, fileSystem]);

  // Обработчики буфера обмена
  const handlePaste = useCallback(async () => {
    try {
      const success = await clipboard.pasteFromClipboard();
      if (success) fileSystem.refresh();
      setContextMenu(null);
    } catch (err) {
      fileSystem.setError(getErrorMessage(err));
    }
  }, [clipboard, fileSystem]);

  // Горячие клавиши
  useKeyboardShortcuts(
    selectedItems, fileSystem.items, clipboard.copyToClipboard, clipboard.cutToClipboard,
    clipboard.pasteFromClipboard, handleDelete, handleRename, () => setContextMenu(null),
    setSelectedItems, clipboard.clipboard, fileSystem.refresh
  );

  // Закрытие контекст-меню по клику
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const handleItemDrop = useCallback(async (e: React.DragEvent, targetFolder: FileEntry) => {
    e.preventDefault();

    const dragData = e.dataTransfer.getData('application/file-shortcut');
    if (!dragData || !systemApi.fileSystem) return;

    const { filePath, name }: FileDragData = JSON.parse(dragData);

    // Не можем перетащить в себя
    if (name === targetFolder.name) return;

    const targetPath = navigation.currentPath === '/'
      ? `/${targetFolder.name}/${name}`
      : `${navigation.currentPath}/${targetFolder.name}/${name}`;

    try {
      await systemApi.fileSystem.move(filePath, targetPath);
      fileSystem.refresh();
    } catch (err) {
      fileSystem.setError(getErrorMessage(err));
    }
  }, [navigation.currentPath, fileSystem]);

  const sorting = useSorting(fileSystem.items);

  return (
    <div className={styles.fileExplorer} ref={containerRef}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={navigation.goBack}
            disabled={navigation.historyIndex === 0}
            title="Back"
          >
            <FontAwesomeIcon icon={faArrowLeft}/>
          </button>
          <button
            className={styles.navBtn}
            onClick={navigation.goForward}
            disabled={navigation.historyIndex >= navigation.history.length - 1}
            title="Forward"
          >
            <FontAwesomeIcon icon={faArrowRight}/>
          </button>
          <button
            className={styles.navBtn}
            onClick={navigation.goUp}
            disabled={navigation.currentPath === '/'}
            title="Up"
          >
            <FontAwesomeIcon icon={faArrowUp}/>
          </button>
          <button className={styles.navBtn} onClick={navigation.goHome} title="Home">
            <FontAwesomeIcon icon={faHome}/>
          </button>
          <button className={styles.navBtn} onClick={fileSystem.refresh} title="Refresh">
            <FontAwesomeIcon icon={faRefresh}/>
          </button>
        </div>

        <div className={styles.addressBar}>
          <input
            type="text"
            value={navigation.currentPath}
            onChange={(e) => navigation.setCurrentPath(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigation.navigateTo((e.target as HTMLInputElement).value);
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

      {/* Error bar */}
      {fileSystem.error && (
        <div className={`${styles.statusBar} ${styles.error}`}>
          <span>Error: {fileSystem.error}</span>
          <button onClick={() => fileSystem.setError('')} className={styles.closeError}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        </div>
      )}

      {/* File list container */}
      <div
        className={styles.fileListContainer}
        onDragEnter={(e) => { e.preventDefault(); setDragOverlay(true); }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.relatedTarget instanceof Node && !e.currentTarget.contains(e.relatedTarget)) {
            setDragOverlay(false);
          }
        }}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
        onDrop={handleDrop}
        onContextMenu={(e) => {
          // Проверяем, не кликнули ли мы на файл
          if (!e.target.closest('.fileItem')) {
            handleContextMenu(e, null);
          }
        }}
      >
        {fileSystem.loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div
            className={styles.fileList}
          >
            <FileList
              items={sorting.sortedItems}
              selectedItems={selectedItems}
              sortState={sorting.sortState}
              onToggleSort={sorting.toggleSort}
              onItemClick={handleItemClick}
              onItemDoubleClick={handleItemDoubleClick}
              onItemDragStart={handleItemDragStart}
              onContextMenu={handleContextMenu}
              onItemDrop={handleItemDrop}
            />
          </div>
        )}

        <DragDropOverlay
          dragOverlay={dragOverlay}
          currentPath={navigation.currentPath}
        />

        <UploadProgress
          uploadProgress={uploadProgress}
          onClose={() => setUploadProgress({})}
        />
      </div>

      {/* Context Menu */}
      <ContextMenu
        contextMenu={contextMenu}
        selectedItems={selectedItems}
        clipboard={clipboard.clipboard}
        onRename={handleRename}
        onCopy={() => { clipboard.copyToClipboard(); setContextMenu(null); }}
        onCut={() => { clipboard.cutToClipboard(); setContextMenu(null); }}
        onPaste={handlePaste}
        onDelete={handleDelete}
        onNewFile={() => { setShowNewDialog(true); setNewItemType('file'); setContextMenu(null); }}
        onNewFolder={() => { setShowNewDialog(true); setNewItemType('folder'); setContextMenu(null); }}
        onRefresh={() => { fileSystem.refresh(); setContextMenu(null); }}
      />

      {/* Dialogs */}
      <NewItemDialog
        show={showNewDialog}
        itemType={newItemType}
        itemName={newItemName}
        onTypeChange={setNewItemType}
        onNameChange={setNewItemName}
        onConfirm={handleNewItem}
        onCancel={() => { setShowNewDialog(false); setNewItemName(''); }}
      />

      <RenameDialog
        item={renameItem}
        onNameChange={(name) => setRenameItem(prev => prev ? { ...prev, newName: name } : null)}
        onConfirm={confirmRename}
        onCancel={() => setRenameItem(null)}
      />
    </div>
  );
};

export { FileExplorer };