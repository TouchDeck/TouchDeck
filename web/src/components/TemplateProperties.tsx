import React, { useCallback, useEffect, useState } from 'react';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { TemplateInfo } from 'touchdeck-model';
import { TextInput } from './input/TextInput';
import removeExtension from '../util/removeExtension';
import { useConnectedAgent, useGlobalState } from '../state/appState';

export interface Props {
  template: TemplateInfo;
  onDelete: () => void;
  onClose: () => void;
}

export const TemplateProperties: React.FC<Props> = ({
  template,
  onDelete,
  onClose,
}) => {
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => setName(removeExtension(template.path)), [template.path]);
  useEffect(() => setText(template.text), [template.text]);

  const upsertTemplate = useCallback(async () => {
    const newPath = `${name}.json`;
    await agent.upsertTemplate(template.path, {
      path: newPath,
      text,
      values: {},
    });

    const newTemplates = await agent.getTemplates();
    dispatch({
      type: 'templatesLoaded',
      templates: newTemplates,
    });
  }, [agent, dispatch, name, template.path, text]);

  return (
    <div className="template-properties properties">
      <TextInput className="name" value={name} onChange={setName} />
      <textarea rows={8} cols={40} value={text} />
      <div className="actions">
        <Button icon="trash" negative onClick={onDelete}>
          Delete
        </Button>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={upsertTemplate} positive icon="save">
            Save
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
