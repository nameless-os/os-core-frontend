// Libraries
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Redux
import { simonClick, startShowing, updateStatus } from '@Simon/redux/simonSlice/simonSlice';
import reduxStore from 'src/redux/store';

// Enums
import { SimonStatus } from '@Simon/enums/simonStatus.enum';
import { App } from '@Enums/app.enum';

// Types
import { RootState } from '@Types/rootState.type';

// Assets
import sound1 from '@Sounds/simon/simon1.mp3';
import sound2 from '@Sounds/simon/simon2.mp3';
import sound3 from '@Sounds/simon/simon3.mp3';
import sound4 from '@Sounds/simon/simon4.mp3';
import sound5 from '@Sounds/simon/simon5.mp3';
import sound6 from '@Sounds/simon/simon6.mp3';
import sound7 from '@Sounds/simon/simon7.mp3';
import sound8 from '@Sounds/simon/simon8.mp3';
import sound9 from '@Sounds/simon/simon9.wav';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { SimonBar } from '@Simon/components/SimonBar/SimonBar';
import { SimonButton } from '@Simon/components/SimonButton/SimonButton';

// Styles
import styles from './simonMain.module.css';

interface Props extends ChildrenNever {
  numberOfButtons: number;
}

const sounds = [sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8, sound9];

export const SimonMain: FC<Props> = React.memo(({ numberOfButtons }: Props) => {
  const dispatch = useDispatch();

  const status = useSelector((store: RootState) => store.simon.simonStatus);
  const pattern = useSelector((store: RootState) => store.simon.pattern);
  const level = useSelector((store: RootState) => store.simon.level);
  const isSimonOpen = useSelector((store: RootState) => store.apps.appsState[App.Simon].isOpen);
  const difficulty = useSelector((store: RootState) => store.simon.difficulty);

  const btnRef1 = useRef<HTMLButtonElement>(null);
  const btnRef2 = useRef<HTMLButtonElement>(null);
  const btnRef3 = useRef<HTMLButtonElement>(null);
  const btnRef4 = useRef<HTMLButtonElement>(null);
  const btnRef5 = useRef<HTMLButtonElement>(null);
  const btnRef6 = useRef<HTMLButtonElement>(null);
  const btnRef7 = useRef<HTMLButtonElement>(null);
  const btnRef8 = useRef<HTMLButtonElement>(null);
  const btnRef9 = useRef<HTMLButtonElement>(null);

  const buttonsRefs = useMemo(() => [btnRef1, btnRef2, btnRef3, btnRef4, btnRef5, btnRef6, btnRef7, btnRef8, btnRef9], []);
  const buttonsRefsWithLimit = buttonsRefs.slice(0, numberOfButtons);

  async function handleClick(numberOfButton: number): Promise<void> {
    await new Audio(sounds[numberOfButton]).play();
    setTimeout(() => buttonsRefs[numberOfButton]?.current?.classList.add(styles.btnActive), 0);
    setTimeout(() => buttonsRefs[numberOfButton]?.current?.classList.remove(styles.btnActive), 400);
    setTimeout(() => dispatch(simonClick({ numberOfButton })), 400);
  }

  useEffect(() => {
    if (status === SimonStatus.Showing) {
      if (pattern.length !== 3 + (level - 1)) {
        dispatch(startShowing());
      } else {
        pattern.forEach((el, index) => {
          setTimeout(async () => {
            // Use getState because hook not update state in setTimeout
            if (!reduxStore.getState().apps.appsState[App.Simon].isOpen) return;
            await new Audio(sounds[el]).play();
          }, 900 * index + 900);
          setTimeout(() => buttonsRefs[el]?.current?.classList.add(styles.btnActive), 900 * index + 900);
          setTimeout(() => buttonsRefs[el]?.current?.classList.remove(styles.btnActive), 900 * index + 1400);
        });
        setTimeout(() => {
          dispatch(updateStatus({ status: SimonStatus.Playing }));
        }, 900 * pattern.length + 400);
      }
    }
  }, [isSimonOpen, pattern, level, status, dispatch, sounds, buttonsRefs]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        {buttonsRefsWithLimit.map((ref, index) => (
          <SimonButton
            btnRef={ref}
            handleClick={handleClick}
            btnNumber={index}
            numberOfButtons={numberOfButtons}
            key={uuidv4()}
          />
        ))}
      </div>
      <SimonBar difficulty={difficulty} />
    </div>
  );
});
