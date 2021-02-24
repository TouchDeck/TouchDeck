import React, { TextareaHTMLAttributes } from 'react';

export interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  onChange: (text: string) => void;
  value?: string;
}

export const TextAreaInput: React.FC<Props> = (props) => {
  return (
    <textarea
      {...props}
      onChange={(e) => props.onChange(e.currentTarget.value)}
    />
  );
};
