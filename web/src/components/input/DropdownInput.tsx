import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from './TextInput';
import { classNames } from '../../util/classNames';
import { searchEntries } from '../../util/searchEntries';

export interface Props<T> {
  value: string;
  options: T[];
  onChange: (value: T | null) => void;
  displayValue: (val: T) => string;
}

export function DropdownInput<T>({
  value,
  options,
  onChange,
  displayValue,
}: Props<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayOptions, setDisplayOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setDisplayOptions(searchEntries(options, searchTerm, displayValue));
  }, [options, searchTerm, displayValue]);

  const selectValue = useCallback(
    (newValue: T) => {
      onChange(newValue);
      setShowDropdown(false);
      setSearchTerm('');
    },
    [onChange]
  );

  return (
    <div
      className="dropdown-input"
      onFocus={() => setShowDropdown(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowDropdown(false);
        }
      }}
    >
      <TextInput
        className={classNames([value ? 'has-value' : 'no-value'])}
        onChange={setSearchTerm}
        value={showDropdown ? searchTerm : value}
        placeholder={value}
        icon={value ? 'times' : 'chevron-down'}
        onClickIcon={value ? () => onChange(null) : undefined}
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
              <span className="name">{displayValue(option)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
