// Libraries
import React, { FC } from 'react';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './inDevelopment.module.css';

const InDevelopment: FC<ChildrenNever> = React.memo(() => (
  <div className={styles.container}>
    <p>In development</p>
  </div>
));

export { InDevelopment };
