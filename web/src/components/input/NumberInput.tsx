import React, { InputHTMLAttributes } from 'react';

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChange: (value: number) => void;
  value?: number;
}

const NumberInput: React.FC<Props> = (props) => (
  <input
    {...props}
    type="number"
    value={props.value?.toString() ?? ''}
    onChange={(e) => props.onChange(parseInt(e.currentTarget.value, 10))}
  />
);

export default NumberInput;
