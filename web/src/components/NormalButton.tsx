import React from 'react';
import Button, { Props as ButtonProps } from './Button';
import { ActionConfig } from '../api/buttons';

export type Props = ButtonProps & {
  onTriggerAction: (action: string) => void;
  action: ActionConfig;
};

const NormalButton: React.FC<Props> = (props) => (
  <Button {...props} onClick={() => props.onTriggerAction(props.action.id)} />
);

export default NormalButton;
