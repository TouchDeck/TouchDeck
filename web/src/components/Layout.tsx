import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './Icon';
import Menu from './Menu';

const Layout: React.FC = ({ children }) => {
  const location = useLocation();
  // If the pathname is longer than 1 ('/'), default the menu to open.
  const [showMenu, setShowMenu] = useState(location.pathname.length > 1);

  return (
    <div className="layout">
      {!showMenu && (
        <Icon
          className="open-menu"
          icon="bars"
          size={2}
          onClick={() => setShowMenu(true)}
        />
      )}
      <Menu open={showMenu} onClose={() => setShowMenu(false)} />
      {children}
    </div>
  );
};

export default Layout;
