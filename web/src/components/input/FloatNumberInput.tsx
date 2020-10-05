import React, { InputHTMLAttributes, useEffect, useState } from 'react';

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChange: (value: number) => void;
  value?: number | string;
}

const FloatNumberInput: React.FC<Props> = (props) => {
  const [stringValue, setStringValue] = useState<string>();
  useEffect(() => setStringValue(props.value?.toString()), [props.value]);

  return (
    <input
      {...props}
      type="number"
      value={stringValue ?? ''}
      onChange={(e) => {
        const newValue = e.currentTarget.value;
        setStringValue(newValue);
        // Parse the new value, only emit onChange if it is valid.
        const parsed = parseFloat(newValue);
        if (parsed.toString() === newValue) {
          console.log(newValue);
          props.onChange(parsed);
        }
      }}
    />
  );
};

export default FloatNumberInput;
