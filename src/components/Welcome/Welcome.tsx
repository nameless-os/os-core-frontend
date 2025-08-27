import { FC } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import space from '@Backgrounds/space.webp';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Avatar } from '@Components/Avatar/Avatar';
import { Button } from '@Components/Button/Button';

import styles from './welcome.module.css';

interface Props extends ChildrenNever {
  handleWelcomeClose: () => void;
}

const Welcome: FC<Props> = ({ handleWelcomeClose }: Props) => {
  const username = '';

  const { t } = useTranslation('welcome');
  const navigate = useNavigate();

  function handleGoToLogin() {
    navigate('/login');
    sessionStorage.setItem('isWelcomeOpen', 'No');
  }

  return (
    <>
      <div className={styles.overlay} style={{ backgroundImage: `url(${space})` }} />
      <motion.main className={styles.main} exit={{ opacity: 0, y: '-50%' }} transition={{ duration: 1 }}>
        {(username && (
          <>
            <Avatar name={username} width={128} height={128} />
            <p>{`${t('hello')}, ${username}`}</p>
            <Button className={styles.enter} onClick={handleWelcomeClose}>
              {t('enter')}
            </Button>
            <Button className={styles.goToLogin} onClick={handleGoToLogin}>
              {t('changeAccount')}
            </Button>
          </>
        )) || (
          <>
            <Button className={styles.enter} onClick={handleGoToLogin}>
              {t('login')}
            </Button>
            <Button className={styles.enter} onClick={handleWelcomeClose}>
              {t('continueAsAGuest')}
            </Button>
          </>
        )}
      </motion.main>
    </>
  );
};

export { Welcome };
