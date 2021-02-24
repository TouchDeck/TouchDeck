import React, { useCallback, useEffect, useState } from 'react';
import { useConnectedAgent } from '../../state/appState';
import { TextInput } from './TextInput';
import { TemplateInfo } from 'touchdeck-model';
import removeExtension from '../../util/removeExtension';

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
    setDisplayTemplates(templates.filter((t) => filterTemplate(searchTerm, t)));
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
        <div className="list">
          {displayTemplates.map((t) => (
            <div
              key={t.path}
              className="entry"
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

function filterTemplate(searchTerm: string, template: TemplateInfo): boolean {
  // Split and sanitize the search term.
  const searchTerms = searchTerm
    .toLowerCase()
    .split(' ')
    .filter((t) => !!t);

  // Check if all search terms match the template.
  for (let searchI = 0; searchI < searchTerms.length; searchI++) {
    if (!template.path.toLowerCase().includes(searchTerms[searchI])) {
      return false;
    }
  }

  return true;
}
