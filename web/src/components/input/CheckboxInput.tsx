import React, { InputHTMLAttributes } from 'react';
import { classNames } from '../../util/classNames';

export interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'value'
  > {
  onChange: (checked: boolean) => void;
}

export const CheckboxInput: React.FC<Props> = (props) => (
  <div
    className={classNames(['checkbox', props.checked && 'checked'])}
    onClick={() => props.onChange(!props.checked)}
  >
    <input
      {...props}
      type="checkbox"
      onChange={(e) => props.onChange(e.currentTarget.checked)}
    />
    <span />
  </div>
);
