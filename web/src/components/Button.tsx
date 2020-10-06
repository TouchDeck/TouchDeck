import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import classNames from '../util/classNames';
import Icon from './Icon';

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  positive?: boolean;
  negative?: boolean;
  compact?: boolean;
  icon?: string;
}

const Button: React.FC<Props> = ({
  children,
  positive,
  negative,
  compact,
  icon,
  ...props
}) => (
  <button
    {...props}
    className={classNames([
      'button',
      props.className,
      positive && 'positive',
      negative && 'negative',
      compact && 'compact',
    ])}
  >
    {icon && <Icon icon={icon} />}
    {children}
  </button>
);

export default Button;
