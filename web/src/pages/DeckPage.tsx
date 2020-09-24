import React, { useState } from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import SettingsCorner from '../components/settings/SettingsCorner';
import Menu from '../components/Menu';
import Icon from '../components/Icon';

const DeckPage: React.FC = () => {
  // TODO
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="deck">
      {/*<SettingsCorner />*/}
      {!showMenu && (
        <div className="open-menu" onClick={() => setShowMenu(true)}>
          <Icon icon="bars" size={3} />
        </div>
      )}
      <Menu open={showMenu} onClose={() => setShowMenu(false)} />
      <ButtonGrid rowCount={3} columnCount={5} editing />
    </div>
  );
};

export default DeckPage;
