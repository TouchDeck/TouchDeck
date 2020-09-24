import React, { useState } from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import Menu from '../components/Menu';
import Icon from '../components/Icon';

const DeckPage: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="deck">
      {!showMenu && (
        <Icon
          className="open-menu"
          icon="bars"
          size={2}
          onClick={() => setShowMenu(true)}
        />
      )}
      <Menu open={showMenu} onClose={() => setShowMenu(false)} />
      <ButtonGrid rowCount={3} columnCount={5} editing />
    </div>
  );
};

export default DeckPage;
