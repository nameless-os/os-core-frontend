import React, { FC, ReactNode } from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  children?: ReactNode;
}

const Scrollbar: FC<Props> = ({ children }: Props) => (
  <Scrollbars
    renderView={(({ style, ...props }) => {
      const viewStyle = {
        overflowX: 'hidden',
      };
      return (
        <div style={{ ...style, ...viewStyle }} {...props} />
      );
    })}
    renderThumbVertical={({ style, ...props }) => (
      <div
        {...props}
        style={{
          ...style,
          backgroundColor: '#3B3B3B',
          paddingLeft: '4px',
        }}
      />
    )}
    autoHide={false}
  >
    {children}
  </Scrollbars>
);

export { Scrollbar };
