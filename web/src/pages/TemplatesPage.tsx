import React, { useCallback, useState } from 'react';
import { TemplateInfo } from 'touchdeck-model';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import { TemplateProperties } from '../components/TemplateProperties';
import { SimpleList } from '../components/SimpleList';
import { Button } from '../components/Button';
import { removeExtension } from '../util/removeExtension';

export const TemplatesPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo>();
  const [, dispatch] = useGlobalState();
  const { agent, templates } = useConnectedAgent();

  const deleteTemplate = useCallback(
    async (template: TemplateInfo) => {
      await agent.deleteTemplate(template.path);
      setSelectedTemplate(undefined);
      const newTemplates = await agent.getTemplates();
      dispatch({
        type: 'templatesLoaded',
        templates: newTemplates,
      });
    },
    [agent, dispatch]
  );

  return (
    <main className="templates-page config-page">
      <SimpleList<TemplateInfo>
        searchPlaceholder="Search templates..."
        entries={templates}
        entryName={(t) => removeExtension(t.path)}
        onClickEntry={setSelectedTemplate}
      >
        <Button
          icon="plus"
          positive
          onClick={() =>
            setSelectedTemplate({
              path: '',
              text:
                'This is a template!\nPut values in here like so: {{ counter }}\nGive it a name, and press save to store it.',
              values: {},
            })
          }
        >
          Template
        </Button>
      </SimpleList>
      {selectedTemplate && (
        <TemplateProperties
          template={selectedTemplate}
          onDelete={() => deleteTemplate(selectedTemplate)}
          onClose={() => setSelectedTemplate(undefined)}
          onUpdate={setSelectedTemplate}
        />
      )}
    </main>
  );
};
