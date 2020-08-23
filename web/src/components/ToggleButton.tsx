import React, { useState } from 'react';
import Button from './Button';
import { ToggleButtonConfig } from '../api/buttons';
import { triggerAction } from '../api/actions';

const ToggleButton: React.FC<ToggleButtonConfig> = ({ state1, state2 }) => {
  const [toggleState, setToggleState] = useState(false);

  const currentState = toggleState ? state1 : state2;
  return (
    <Button
      {...currentState}
      onClick={async () => {
        await triggerAction(currentState.action.id);
        setToggleState((prevState) => !prevState);
      }}
    />
  );
};

export default ToggleButton;
