import React from 'react';
import ButtonGrid from './components/ButtonGrid';

const App: React.FC = () => (
  <div className="App">
    <ButtonGrid
      rowWidth={4}
      buttons={[
        {
          text: 'button 1',
        },
        {
          text: 'button 2',
        },
        {
          text: 'button 3',
        },
        {
          text: 'button 4',
        },
        {
          text: 'button 1',
        },
        {
          text: 'button 2',
        },
      ]}
    />
  </div>
);

export default App;
