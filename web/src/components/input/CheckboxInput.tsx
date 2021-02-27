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
  <div className={classNames(['checkbox', props.checked && 'checked'])}>
    <input
      {...props}
      type="checkbox"
      onChange={(e) => props.onChange(e.currentTarget.checked)}
    />
    <span
      onClick={() => props.onChange(!props.checked)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          props.onChange(!props.checked);
        }
      }}
    />
  </div>
);
