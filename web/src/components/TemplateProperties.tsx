import React from 'react';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { TemplateInfo } from 'touchdeck-model';

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
  return (
    <div className="template-properties">
      <div className="actions">
        <Button icon="trash" negative onClick={onDelete}>
          Delete
        </Button>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => {}} positive icon="save">
            Save
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
