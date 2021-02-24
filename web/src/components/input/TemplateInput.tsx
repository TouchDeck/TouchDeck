import React, { useCallback, useEffect, useState } from 'react';
import { useConnectedAgent } from '../../state/appState';
import { TextInput } from './TextInput';
import { TemplateInfo } from 'touchdeck-model';
import { removeExtension } from '../../util/removeExtension';
import { searchEntries } from '../../util/searchEntries';

export interface Props {
  value: string;
  onChange: (template: string | null) => void;
}

export const TemplateInput: React.FC<Props> = ({ value, onChange }) => {
  const { templates } = useConnectedAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayTemplates, setDisplayTemplates] = useState(templates);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setDisplayTemplates(searchEntries(templates, searchTerm, (t) => t.path));
  }, [templates, searchTerm]);

  const selectTemplate = useCallback(
    (template: TemplateInfo) => {
      onChange(template.path);
      setShowDropdown(false);
      setSearchTerm('');
    },
    [onChange]
  );

  const valueString = value ? removeExtension(value) : '';

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
        onChange={setSearchTerm}
        value={showDropdown ? searchTerm : valueString}
        placeholder={valueString}
        icon={value ? 'times' : undefined}
        onClickIcon={() => onChange(null)}
      />
      {showDropdown && (
        <div className="dropdown-list">
          {displayTemplates.map((t) => (
            <div
              key={t.path}
              className="dropdown-entry"
              onClick={() => selectTemplate(t)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectTemplate(t);
                }
              }}
            >
              <span className="name">{removeExtension(t.path)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
