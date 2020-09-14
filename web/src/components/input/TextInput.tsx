import React, { InputHTMLAttributes } from 'react';

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (text: string) => void;
  type?: 'text' | 'password';
  value?: string;
}

const TextInput: React.FC<Props> = (props) => (
  <input
    {...props}
    value={props.value || ''}
    onChange={(e) => props.onChange(e.currentTarget.value)}
  />
);

export default TextInput;
