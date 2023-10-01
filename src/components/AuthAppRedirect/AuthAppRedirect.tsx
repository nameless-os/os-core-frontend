// Libraries
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './authAppRedirect.module.css';

const AuthAppRedirect: FC<ChildrenNever> = React.memo(() => {
  const navigate = useNavigate();

  const { t } = useTranslation('authRedirect');

  function handleClick() {
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <p className={styles.text}>{t('authRedirect.pleaseLogin')}</p>
      <Button onClick={handleClick} className={styles.btn}>{t('authRedirect.goToLogin')}</Button>
    </div>
  );
});

export { AuthAppRedirect };
