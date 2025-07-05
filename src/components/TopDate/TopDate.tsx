import { FC, useEffect, useState } from 'react';

import { Language } from '@Features/i18n/types/language';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { useTypedSelector } from '@Hooks';

import styles from './topDate.module.css';

export const TopDate: FC<ChildrenNever> = () => {
  const language = useTypedSelector((state) => state.settings.language);
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
