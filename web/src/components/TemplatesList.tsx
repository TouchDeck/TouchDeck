import React, { useLayoutEffect, useState } from 'react';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import Button from './Button';
import { List } from './List';
import { TemplateInfo } from 'touchdeck-model';
import removeExtension from '../util/removeExtension';

export interface Props {
  onClickTemplate: (template: TemplateInfo) => void;
}

export const TemplatesList: React.FC<Props> = ({ onClickTemplate }) => {
  const [, dispatch] = useGlobalState();
  const { agent, templates } = useConnectedAgent();

  const [showTemplates, setShowTemplates] = useState(templates);
  const [searchTerm, setSearchTerm] = useState('');
  useLayoutEffect(() => {
    setShowTemplates(
      templates
        .filter((t) => filterTemplate(searchTerm, t))
        .sort((a, b) => a.path.localeCompare(b.path))
    );
  }, [templates, searchTerm]);

  // TODO: Refactor lists (images-list, this) to a generic component.
  return (
    <List
      className="images-list"
      searchPlaceholder="Search templates..."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <Button icon="plus" positive>
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
