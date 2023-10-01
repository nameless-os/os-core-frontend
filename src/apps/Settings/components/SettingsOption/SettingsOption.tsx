// Libraries
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Enums
import { Theme } from '@Features/theme/types/theme';
import { Language } from '@Features/i18n/types/language';
import { BackgroundImage } from '@Features/theme/types/backgroundImage';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

interface Props extends ChildrenNever {
  value: BackgroundImage | Theme | Language;
  category: string;
}

const SettingsOption: FC<Props> = React.memo(({ value, category }: Props) => {
  const { t } = useTranslation('settings');

  return (
    <option value={value}>{t(`${category}.${value}`)}</option>
  );
});

export { SettingsOption };
