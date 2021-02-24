import React, { InputHTMLAttributes } from 'react';

export interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'value'
  > {
  onChange: (checked: boolean) => void;
}

export const CheckboxInput: React.FC<Props> = (props) => (
  <input
    {...props}
    type="checkbox"
    onChange={(e) => props.onChange(e.currentTarget.checked)}
  />
);
