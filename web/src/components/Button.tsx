import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import classNames from '../util/classNames';

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  positive?: boolean;
  negative?: boolean;
}

const Button: React.FC<Props> = ({
  children,
  positive,
  negative,
  ...props
}) => (
  <button
    {...props}
    className={classNames([
      'button',
      props.className,
      positive && 'positive',
      negative && 'negative',
    ])}
  >
    {children}
  </button>
);

export default Button;
