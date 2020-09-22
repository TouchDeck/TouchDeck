import React, { useState } from 'react';
import Button, { ButtonProps } from './Button';
import { ToggleButtonState } from '../../model/configuration/ButtonConfig';

export interface Props extends ButtonProps {
  onTriggerAction: (action: string) => void;
  state1: ToggleButtonState;
  state2: ToggleButtonState;
}

const ToggleButton: React.FC<Props> = (props) => {
  const { state1, state2, onTriggerAction, size } = props;

  const [toggleState, setToggleState] = useState(false);

  const currentState = toggleState ? state1 : state2;
  return (
    <Button
      {...props}
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
