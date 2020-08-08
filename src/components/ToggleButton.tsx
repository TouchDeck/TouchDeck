import React, { useState } from 'react';
import Button from './Button';
import { ToggleButtonConfig } from '../api/configuration';
import { triggerAction } from '../api/actions';

const ToggleButton: React.FC<ToggleButtonConfig> = ({ state1, state2 }) => {
  const [toggleState, setToggleState] = useState(false);

  const currentState = toggleState ? state1 : state2;
  return (
    <Button
      {...currentState}
      onClick={(): void => {
        triggerAction(currentState.uuid);
        setToggleState((prevState) => !prevState);
      }}
    />
  );
};

export default ToggleButton;
