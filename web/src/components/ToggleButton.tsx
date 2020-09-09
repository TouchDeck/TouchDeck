import React, { useState } from 'react';
import Button, { Props as ButtonProps } from './Button';
import { ActionConfig } from '../api/buttons';

export interface Props {
  onTriggerAction: (action: string) => void;
  state1: ButtonProps & { action: ActionConfig };
  state2: ButtonProps & { action: ActionConfig };
}

const ToggleButton: React.FC<Props> = ({ state1, state2, onTriggerAction }) => {
  const [toggleState, setToggleState] = useState(false);

  const currentState = toggleState ? state1 : state2;
  return (
    <Button
      {...currentState}
      onClick={async () => {
        onTriggerAction(currentState.action.id);
        setToggleState((prevState) => !prevState);
      }}
    />
  );
};

export default ToggleButton;
