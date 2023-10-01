// Libraries
import React, { FC } from 'react';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Constants
import { DEFAULT_IMAGE_LINK } from './constants/defaultImageLink';

// Styles
import styles from './avatar.module.css';

interface Props extends ChildrenNever {
  link?: string;
  height?: number;
  width?: number;
  name: string;
}

const Avatar: FC<Props> = React.memo(({ link, name, height = 56, width = 56 }: Props) => {
  if (link) {
    return <img src={link || DEFAULT_IMAGE_LINK} alt="avatar" className={styles.avatar} width={width} height={height} />;
  }

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className={styles.avatarContainer}>
      {name[0].toUpperCase()}
    </div>
  );
});

export { Avatar };
