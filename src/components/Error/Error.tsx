// Libraries
import React, { FC } from 'react';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './error.module.css';

interface Props extends ChildrenNever {
  refetch: () => void;
}

const Error: FC<Props> = React.memo(({ refetch }: Props) => (
  <div className={styles.errorContainer}>
    Error, try again later
    <Button onClick={refetch}>
      <FontAwesomeIcon icon={faArrowsRotate} />
    </Button>
  </div>
));

export { Error };
