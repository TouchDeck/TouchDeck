import React, { useLayoutEffect, useState } from 'react';
import { useConnectedAgent } from '../state/appState';
import Button from './Button';
import { List } from './List';
import { TemplateInfo } from 'touchdeck-model';
import removeExtension from '../util/removeExtension';
import { searchEntries } from '../util/searchEntries';

export interface Props {
  onClickTemplate: (template: TemplateInfo) => void;
  onCreateTemplate: () => void;
}

export const TemplatesList: React.FC<Props> = ({
  onClickTemplate,
  onCreateTemplate,
}) => {
  const { templates } = useConnectedAgent();

  const [showTemplates, setShowTemplates] = useState(templates);
  const [searchTerm, setSearchTerm] = useState('');
  useLayoutEffect(() => {
    setShowTemplates(searchEntries(templates, searchTerm, (t) => t.path));
  }, [templates, searchTerm]);

  return (
    <List
      searchPlaceholder="Search templates..."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <Button icon="plus" positive onClick={onCreateTemplate}>
        Template
      </Button>
      <div className="entries">
        {showTemplates.map((template) => {
          return (
            <div
              key={template.path}
              className="entry"
              onClick={() => onClickTemplate(template)}
            >
              <span className="name">{removeExtension(template.path)}</span>
            </div>
          );
        })}
      </div>
    </List>
  );
};
