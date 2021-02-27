import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from './TextInput';
import { classNames } from '../../util/classNames';
import { searchEntries } from '../../util/searchEntries';

export type Props<T> = {
  value?: string;
  options: T[];
  displayValue: (val: T) => string;
  previewImageUrl?: (val: T) => string;
} & (ClearableProps<T> | NonClearableProps<T>);

interface ClearableProps<T> {
  clearable: true;
  onChange: (value: T | null) => void;
}

interface NonClearableProps<T> {
  clearable?: false;
  onChange: (value: T) => void;
}

export function DropdownInput<T>({
  value,
  options,
  onChange,
  displayValue,
  previewImageUrl,
  clearable,
}: Props<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayOptions, setDisplayOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setDisplayOptions(searchEntries(options, searchTerm, displayValue));
  }, [options, searchTerm, displayValue]);

  const selectValue = useCallback(
    (newValue: T | null) => {
      if (clearable || newValue != null) {
        onChange(newValue as T);
      }

      setShowDropdown(false);
      setSearchTerm('');
    },
    [clearable, onChange]
  );

  return (
    <div
      className={classNames([
        'dropdown-input',
        value ? 'has-value' : 'no-value',
        clearable && 'clearable',
      ])}
      onFocus={() => setShowDropdown(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowDropdown(false);
        }
      }}
    >
      <TextInput
        onChange={setSearchTerm}
        value={showDropdown ? searchTerm : value}
        placeholder={value}
        icon={clearable && value ? 'times' : 'chevron-down'}
        onClickIcon={clearable && value ? () => selectValue(null) : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            selectValue(null);
          }
        }}
      />
      {showDropdown && (
        <div className="dropdown-list">
          {displayOptions.map((option, i) => (
            <div
              key={i}
              className="dropdown-entry"
              onClick={() => selectValue(option)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectValue(option);
                }
              }}
            >
              {previewImageUrl && (
                <div
                  className="preview"
                  style={{
                    backgroundImage: `url(${previewImageUrl(option)})`,
                  }}
                />
              )}
              <span className="name">{displayValue(option)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
