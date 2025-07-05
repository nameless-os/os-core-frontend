import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CommonAppProps, App } from '@webos-project/common';

import { changeDifficulty } from '@Simon/redux/simonSlice/simonSlice';
import { Window } from '@Components/Window/Window';
import { SimonMain } from '@Simon/components/SimonMain/SimonMain';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';
import { SimonDifficulty } from '@Simon/enums/simonDifficulty.enum';

import styles from './simon.module.css';

export const Simon: FC<CommonAppProps> = React.memo(({ appId }) => {
  const dispatch = useTypedDispatch();

  const difficulty = useTypedSelector((state) => state.simon.difficulty);
  const { t } = useTranslation('simon');

  const chooseDifficulty = (chosenDifficulty: SimonDifficulty) => {
    dispatch(changeDifficulty({ difficulty: chosenDifficulty }));
  };

  return (
    <>
      <Window type={App.Simon} appId={appId}>
        {difficulty === SimonDifficulty.None && (
          <div className={styles.difficulties}>
            <h2>{t('chooseDifficulty')}:</h2>
            <ul className={styles.difficultiesList}>
              <li>
                <Button onClick={() => chooseDifficulty(SimonDifficulty.Easy)} className={styles.difficultyButton}>
                  {t(`difficulties.${SimonDifficulty.Easy}`)}
                </Button>
              </li>
              <li>
                <Button onClick={() => chooseDifficulty(SimonDifficulty.Medium)} className={styles.difficultyButton}>
                  {t(`difficulties.${SimonDifficulty.Medium}`)}
                </Button>
              </li>
              <li>
                <Button onClick={() => chooseDifficulty(SimonDifficulty.Hard)} className={styles.difficultyButton}>
                  {t(`difficulties.${SimonDifficulty.Hard}`)}
                </Button>
              </li>
              <li>
                <Button onClick={() => chooseDifficulty(SimonDifficulty.Extreme)} className={styles.difficultyButton}>
                  {t(`difficulties.${SimonDifficulty.Extreme}`)}
                </Button>
              </li>
            </ul>
          </div>
        )}
        {(difficulty === SimonDifficulty.Easy || difficulty === SimonDifficulty.Medium) && <SimonMain numberOfButtons={4} />}
        {(difficulty === SimonDifficulty.Hard || difficulty === SimonDifficulty.Extreme) && <SimonMain numberOfButtons={9} />}
      </Window>
    </>
  );
});
