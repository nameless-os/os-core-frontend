import { useState, useCallback } from 'react';
import { ImageState } from '../types/mediaTypes';

export const useImageControls = () => {
  const [state, setState] = useState<ImageState>({
    zoom: 100,
    position: { x: 0, y: 0 },
    dragging: false,
    dragStart: { x: 0, y: 0 }
  });

  const setZoom = useCallback((zoom: number | ((prev: number) => number)) => {
    setState(prev => ({
      ...prev,
      zoom: typeof zoom === 'function' ? zoom(prev.zoom) : zoom
    }));
  }, []);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    setState(prev => ({ ...prev, position }));
  }, []);

  const startDragging = useCallback((clientX: number, clientY: number) => {
    setState(prev => ({
      ...prev,
      dragging: true,
      dragStart: { x: clientX - prev.position.x, y: clientY - prev.position.y }
    }));
  }, []);

  const updateDragging = useCallback((clientX: number, clientY: number) => {
    setState(prev => {
      if (!prev.dragging) return prev;
      return {
        ...prev,
        position: {
          x: clientX - prev.dragStart.x,
          y: clientY - prev.dragStart.y
        }
      };
    });
  }, []);

  const stopDragging = useCallback(() => {
    setState(prev => ({ ...prev, dragging: false }));
  }, []);

  const resetView = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: 100,
      position: { x: 0, y: 0 }
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(500, prev + 25));
  }, [setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(10, prev - 25));
  }, [setZoom]);

  const handleWheel = useCallback((deltaY: number) => {
    setZoom(prev => {
      const next = deltaY > 0 ? prev - 10 : prev + 10;
      return Math.max(10, Math.min(500, next));
    });
  }, [setZoom]);

  return {
    ...state,
    setZoom,
    setPosition,
    startDragging,
    updateDragging,
    stopDragging,
    resetView,
    zoomIn,
    zoomOut,
    handleWheel
  };
};
