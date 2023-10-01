// Libraries
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Features
import { Language } from '@Features/i18n/types/language';

// Types
import { RootState } from '@Types/rootState.type';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './topDate.module.css';

export const TopDate: FC<ChildrenNever> = () => {
  const language = useSelector((state: RootState) => state.language.language);
  const [date, setDate] = useState(new Date());

  const locale = language === Language.Russian ? 'ru-RU' : 'en-GB';

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <p className={styles.date}>
      {date.toLocaleDateString(locale, {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })}
    </p>
  );
};
