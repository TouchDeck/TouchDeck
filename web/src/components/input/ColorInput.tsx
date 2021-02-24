import React, { useRef, useState } from 'react';
import { CompactPicker } from 'react-color';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface Props {
  value: string;
  onChange: (color: string) => void;
}

export const ColorInput: React.FC<Props> = ({ value, onChange }) => {
  const [displayPicker, setDisplayPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setDisplayPicker(false));

  return (
    <div className="color-input" ref={ref}>
      <div
        className="swatch"
        onClick={() => setDisplayPicker((prev) => !prev)}
        style={{
          backgroundColor: value,
        }}
      >
        <code className="value">{value}</code>
      </div>
      {displayPicker && (
        <div className="popover">
          <CompactPicker color={value} onChange={(c) => onChange(c.hex)} />
        </div>
      )}
    </div>
  );
};
