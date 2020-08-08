import React, { useEffect, useState } from 'react';
import ButtonGrid from './components/ButtonGrid';
import { ButtonConfig, getButtonConfiguration } from './api/configuration';

const App: React.FC = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  useEffect((): void => {
    setButtons(getButtonConfiguration());
  }, []);

  return (
    <div className="App">
      <ButtonGrid rowWidth={4} buttons={buttons} />
    </div>
  );
};

export default App;
