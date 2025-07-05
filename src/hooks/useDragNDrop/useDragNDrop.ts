import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import React, { RefObject, useCallback, useEffect, useState } from 'react';

import { getPxFromRem, App, Position } from '@webos-project/common';
import { useTypedDispatch } from '@Hooks';

import { setWindowActive } from 'src/redux/slices/appsSlice/apps.slice';

const useDragNDrop = (
  changeCoordinates: ActionCreatorWithPayload<{
    appId: string;
    newPosition: Position;
  }>,
  element: RefObject<HTMLDivElement>,
  coords: Position,
  type: App,
  appId: string,
) => {
  const [topCoordinatesLocal, setTopCoordinatesLocal] = useState(coords.top);
  const [leftCoordinatesLocal, setLeftCoordinatesLocal] = useState(coords.left);
  const [shiftLeft, setShiftLeft] = useState(0);
  const [shiftTop, setShiftTop] = useState(0);
  const [isDrag, setIsDrag] = useState(false);

  const dispatch = useTypedDispatch();

  const drag = useCallback(
    (event: MouseEvent) => {
      const heightOfWindow = element!.current?.getBoundingClientRect().height || 0;
      const widthOfWindow = element!.current?.getBoundingClientRect().width || 0;
      const topLimit = getPxFromRem(2.2);
      const leftLimit = 0;
      const bottomLimit = window.innerHeight - heightOfWindow - topLimit;
      const rightLimit = window.innerWidth - widthOfWindow;

      let left = event.pageX - shiftLeft;
      let top = event.pageY - shiftTop;

      if (top < topLimit) {
        top = topLimit;
      }
      if (left < leftLimit) {
        left = leftLimit;
      }
      if (top > bottomLimit) {
        top = bottomLimit;
      }
      if (left > rightLimit) {
        left = rightLimit;
      }

      setTopCoordinatesLocal(top);
      setLeftCoordinatesLocal(left);
    },
    [element, shiftLeft, shiftTop],
  );

  const stopDrag = useCallback(() => {
    dispatch(
      changeCoordinates({
        appId,
        newPosition: {
          top: topCoordinatesLocal,
          left: leftCoordinatesLocal,
        },
      }),
    );
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    setIsDrag(false);
  }, [changeCoordinates, dispatch, drag, element, leftCoordinatesLocal, topCoordinatesLocal, type]);

  const startDrag = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setWindowActive(appId));
    setShiftLeft(event.clientX - element.current!.getBoundingClientRect().x);
    setShiftTop(event.clientY - element.current!.getBoundingClientRect().y);
    setIsDrag(true);
  };

  useEffect(() => {
    if (!isDrag) return;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  }, [isDrag, drag, stopDrag]);

  const newCoords: Position = {
    top: topCoordinatesLocal,
    left: leftCoordinatesLocal,
  };

  return { startDrag, newCoords, isDrag };
};

export { useDragNDrop };
