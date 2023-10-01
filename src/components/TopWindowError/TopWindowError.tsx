import { Button } from '@Components/Button/Button';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { FC } from 'react';
import styles from './topWindowError.module.css';

interface Props extends ChildrenNever {
  handleClick: () => void;
  error: string;
}

const TopWindowError: FC<Props> = ({ handleClick, error }: Props) => (
  <div className={error ? styles.error : styles.emptyError}>
    {error ? (
      <>
        <span>Connection error, please try again later</span>
        <Button className={styles.closeError} onClick={handleClick}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </>
    ) : null}
  </div>
);

export { TopWindowError };
