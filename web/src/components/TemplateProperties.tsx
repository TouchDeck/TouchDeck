import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { TemplateInfo } from 'touchdeck-model';
import { TextInput } from './input/TextInput';
import { removeExtension } from '../util/removeExtension';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import { TextAreaInput } from './input/TextAreaInput';

export interface Props {
  template: TemplateInfo;
  onDelete: () => void;
  onClose: () => void;
  onUpdate: (template: TemplateInfo) => void;
}

export const TemplateProperties: React.FC<Props> = ({
  template,
  onDelete,
  onClose,
  onUpdate,
}) => {
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();
  const [path, setPath] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    setPath(template.path);
    setName(removeExtension(template.path));
  }, [template.path]);
  useEffect(() => setText(template.text), [template.text]);

  const upsertTemplate = useCallback(async () => {
    const newPath = `${name}.json`;
    const updatedTemplate = {
      path: newPath,
      text,
      values: {},
    };
    await agent.upsertTemplate(path, updatedTemplate);

    const newTemplates = await agent.getTemplates();
    dispatch({
      type: 'templatesLoaded',
      templates: newTemplates,
    });

    onUpdate(updatedTemplate);
  }, [agent, dispatch, name, path, text, onUpdate]);

  return (
    <div className="template-properties properties">
      <TextInput
        className="name"
        value={name}
        onChange={setName}
        placeholder="Template name"
      />
      <TextAreaInput
        rows={8}
        cols={40}
        value={text}
        onChange={setText}
        placeholder="Template value: {{ variable }}"
      />
      <div className="actions">
        <Button icon="trash" negative onClick={onDelete}>
          Delete
        </Button>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={upsertTemplate}
            positive
            icon="save"
            disabled={!name}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
