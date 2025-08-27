import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsRotate,
  faCompress,
  faExpand,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../mediaViewer.module.css';
import { ImageState } from '../../types/mediaTypes';

interface ImageViewerProps {
  mediaUrl: string;
  fileName: string;
  imageState: ImageState;
  uiVisible: boolean;
  isFullscreen: boolean;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
                                                          mediaUrl,
                                                          fileName,
                                                          imageState,
                                                          uiVisible,
                                                          isFullscreen,
                                                          onWheel,
                                                          onMouseDown,
                                                          onMouseMove,
                                                          onMouseUp,
                                                          onZoomIn,
                                                          onZoomOut,
                                                          onResetView,
                                                          onToggleFullscreen,
                                                        }) => {
  const { zoom, position, dragging } = imageState;

  return (
    <>
      <div className={`${styles.topBar} ${uiVisible ? styles.visible : styles.hidden}`}>
        <div className={styles.topActions}>
          <button
            className={styles.iconBtn}
            onClick={onZoomOut}
            title="Zoom out (-)"
          >
            <FontAwesomeIcon icon={faMagnifyingGlassMinus}/>
          </button>
          <button
            className={styles.iconBtn}
            onClick={onZoomIn}
            title="Zoom in (+)"
          >
            <FontAwesomeIcon icon={faMagnifyingGlassPlus}/>
          </button>
          <button
            className={styles.iconBtn}
            onClick={onResetView}
            title="Reset zoom (0)"
          >
            <FontAwesomeIcon icon={faArrowsRotate}/>
          </button>
          <button
            className={styles.iconBtn}
            onClick={onToggleFullscreen}
            title="Fullscreen (F)"
          >
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand}/>
          </button>
        </div>
      </div>
      <button
        className={styles.media}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          cursor: zoom > 100 ? (dragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          src={mediaUrl}
          alt={fileName}
          className={styles.image}
          style={{
            maxWidth: zoom <= 100 ? '100%' : 'none',
            maxHeight: zoom <= 100 ? '100%' : 'none',
            width: zoom > 100 ? `${zoom}%` : 'auto',
            height: zoom > 100 ? `${zoom}%` : 'auto',
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          draggable={false}
        />
      </button>
    </>
  );
};