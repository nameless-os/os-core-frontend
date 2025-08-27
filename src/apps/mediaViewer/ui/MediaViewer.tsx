import React, { useRef, useEffect } from 'react';
import styles from './mediaViewer.module.css';
import { MediaViewerProps } from '../types/mediaTypes';
import { getFileName } from '../utils/mediaUtils';
import { useMediaLoader } from '../hooks/useMediaLoader';
import { useImageControls } from '../hooks/useImageControls';
import { useVideoControls } from '../hooks/useVideoControls';
import { useFullscreen } from '../hooks/useFullscreen';
import { useUIVisibility } from '../hooks/useUIVisibility';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { ImageViewer } from './components/ImageViewer';
import { VideoViewer } from './components/VideoViewer';

// eslint-disable-next-line react/prop-types
const MediaViewer: React.FC<MediaViewerProps> = React.memo(({ filePath }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { mediaUrl, kind, loading, error, loadMedia, cleanup } = useMediaLoader(filePath);

  const imageControls = useImageControls();

  const videoControls = useVideoControls();

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);

  const { uiVisible, handleUserActivity } = useUIVisibility(
    videoControls.playing,
    kind === 'video'
  );

  useKeyboardControls({
    kind,
    playing: videoControls.playing,
    videoRef,
    onToggleFullscreen: toggleFullscreen,
    onZoomIn: imageControls.zoomIn,
    onZoomOut: imageControls.zoomOut,
    onResetView: imageControls.resetView,
    onVolumeChange: videoControls.setVolume,
    onMuteToggle: () => {
      const video = videoRef.current;
      if (video) {
        videoControls.toggleMute(video);
      }
    }
  });

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleImageWheel = (e: React.WheelEvent) => {
    if (kind !== 'image') return;
    e.preventDefault();
    imageControls.handleWheel(e.deltaY);
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (kind !== 'image' || imageControls.zoom <= 100) return;
    imageControls.startDragging(e.clientX, e.clientY);
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (kind !== 'image') return;
    imageControls.updateDragging(e.clientX, e.clientY);
  };

  const handleVideoLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    videoControls.setDuration(video.duration || 0);
    video.volume = videoControls.volume;
    video.muted = videoControls.muted;
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      videoControls.updateProgress(video);
    }
  };

  const handleVideoPlay = () => {
    videoControls.setPlaying(true);
  };

  const handleVideoPause = () => {
    videoControls.setPlaying(false);
  };

  const handleTogglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      videoControls.togglePlayPause(video);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (video) {
      videoControls.toggleMute(video);
    }
  };

  const handleVolumeChange = (volume: number) => {
    const video = videoRef.current;
    if (video) {
      videoControls.changeVolume(video, volume);
    }
  };

  const handleSeek = (progressPercent: number) => {
    const video = videoRef.current;
    if (video) {
      videoControls.seekTo(video, progressPercent);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadMedia} />;
  }

  if (!mediaUrl) {
    return <ErrorState error="No media to display" onRetry={loadMedia} />;
  }

  const fileName = getFileName(filePath);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseMove={handleUserActivity}
      onMouseLeave={() => handleUserActivity()}
      onDoubleClick={toggleFullscreen}
    >
      {kind === 'image' && (
        <ImageViewer
          mediaUrl={mediaUrl}
          fileName={fileName}
          imageState={imageControls}
          uiVisible={uiVisible}
          isFullscreen={isFullscreen}
          onWheel={handleImageWheel}
          onMouseDown={handleImageMouseDown}
          onMouseMove={handleImageMouseMove}
          onMouseUp={imageControls.stopDragging}
          onZoomIn={imageControls.zoomIn}
          onZoomOut={imageControls.zoomOut}
          onResetView={imageControls.resetView}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {kind === 'video' && (
        <VideoViewer
          mediaUrl={mediaUrl}
          fileName={fileName}
          videoState={videoControls}
          uiVisible={uiVisible}
          isFullscreen={isFullscreen}
          videoRef={videoRef}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onLoadedMetadata={handleVideoLoadedMetadata}
          onTimeUpdate={handleVideoTimeUpdate}
          onProgress={handleVideoTimeUpdate}
          onTogglePlayPause={handleTogglePlayPause}
          onToggleMute={handleToggleMute}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          onToggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
});

MediaViewer.displayName = 'MediaViewer';

export { MediaViewer };
