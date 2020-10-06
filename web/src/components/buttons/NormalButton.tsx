import React from 'react';
import GridButton, { Props as ButtonProps } from './GridButton';
import ActionConfig from '../../model/configuration/ActionConfig';

export interface Props extends ButtonProps {
  onTriggerAction: (action: string) => void;
  action: ActionConfig;
}

const NormalButton: React.FC<Props> = (props) => (
  <GridButton
    {...props}
    onClick={() => props.onTriggerAction(props.action.id)}
  />
);

export default NormalButton;
