import React, { ButtonHTMLAttributes, FC, ForwardedRef, ReactNode } from 'react';

import styles from './button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  type?: 'reset' | 'submit' | 'button';
  forwardedRef?: ForwardedRef<HTMLButtonElement>;
}

const Button: FC<Props> = React.memo(({ children, className, type = 'button', forwardedRef, ...props }: Props) => (
  // eslint-disable-next-line react/button-has-type
  <button className={`${styles.button} ${className}`} type={type} {...props} ref={forwardedRef}>{children}</button>
));

export { Button };
