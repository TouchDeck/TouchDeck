import React, { useEffect, useState } from 'react';
import { useConnectedAgent } from '../../state/appState';
import { ActionOption } from 'touchdeck-model';

export interface Props {
  actionType: string;
  onChange: (type: string) => void;
}

const ActionOptions: React.FC<Props> = ({ actionType, onChange }) => {
  const { actionOptions } = useConnectedAgent();

  const [optionGroups, setOptionGroups] = useState<{
    [category: string]: ActionOption[];
  }>({});

  useEffect(() => {
    // All category groups.
    // This is initialized with the empty category so that appears as the top of the list.
    const groups: { [category: string]: ActionOption[] } = { '': [] };

    // Sort all actions into groups.
    actionOptions.forEach((option) => {
      const group = groups[option.category] || [];
      group.push(option);
      groups[option.category] = group;
    });
    setOptionGroups(groups);
  }, [actionOptions]);

  return (
    <select
      value={actionType}
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {Object.entries(optionGroups).map(([category, options]) => (
        <optgroup key={category} label={category}>
          {options.map((option) => (
            <option key={option.type} value={option.type}>
              {option.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default ActionOptions;
