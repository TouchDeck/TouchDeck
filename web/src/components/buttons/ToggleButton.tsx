import React, { useState } from 'react';
import Button from './Button';
import { ToggleButtonState } from '../../model/configuration/ButtonConfig';

export interface Props {
  onTriggerAction: (action: string) => void;
  state1: ToggleButtonState;
  state2: ToggleButtonState;
  size: number;
  buttonsPerRow: number;
}

const ToggleButton: React.FC<Props> = ({
  state1,
  state2,
  onTriggerAction,
  size,
}) => {
  const [toggleState, setToggleState] = useState(false);

  const currentState = toggleState ? state1 : state2;
  return (
    <Button
      {...currentState}
      onClick={async () => {
        onTriggerAction(currentState.action.id);
        setToggleState((prevState) => !prevState);
      }}
      size={size}
    />
  );
};

export default ToggleButton;
