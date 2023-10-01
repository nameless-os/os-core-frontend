// Libraries
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Utils
import { getPxFromRem } from 'src/utils/getPxFromRem';

// Enums
import { App } from '@Enums/app.enum';

// Types
import { Coordinates } from '@Interfaces/coordinates.interface';

// Redux
import { setWindowActive } from 'src/redux/slices/appsSlice/appsSlice';

const useDragNDrop = (
  changeCoordinates: ActionCreatorWithPayload<{
    type: App, coordinates: Coordinates
  }>, element: RefObject<HTMLDivElement>, coords: Coordinates, type: App,
) => {
  const [topCoordinatesLocal, setTopCoordinatesLocal] = useState(coords.top);
  const [leftCoordinatesLocal, setLeftCoordinatesLocal] = useState(coords.left);
  const [shiftLeft, setShiftLeft] = useState(0);
  const [shiftTop, setShiftTop] = useState(0);
  const [isDrag, setIsDrag] = useState(false);

  const dispatch = useDispatch();

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

      setTopCoordinatesLocal(`${top / getPxFromRem(1)}rem`);
      setLeftCoordinatesLocal(`${left / getPxFromRem(1)}rem`);
    },
    [element, shiftLeft, shiftTop],
  );

  const stopDrag = useCallback(() => {
    dispatch(
      changeCoordinates({
        type,
        coordinates: {
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
    dispatch(setWindowActive(type));
    setShiftLeft(event.clientX - element.current!.getBoundingClientRect().x);
    setShiftTop(event.clientY - element.current!.getBoundingClientRect().y);
    setIsDrag(true);
  };

  useEffect(() => {
    if (!isDrag) return;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  }, [isDrag, drag, stopDrag]);

  const newCoords: Coordinates = {
    top: topCoordinatesLocal,
    left: leftCoordinatesLocal,
  };

  return { startDrag, newCoords, isDrag };
};

export { useDragNDrop };
