import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Menu from './Menu';

const Layout: React.FC = ({ children }) => {
  const location = useLocation();
  // If the pathname is longer than 1 ('/'), default the menu to open.
  const [showMenu, setShowMenu] = useState(location.pathname.length > 1);

  return (
    <div className="layout">
      {!showMenu && (
        <Link to="/buttons">
          <Icon
            className="open-menu"
            icon="bars"
            size={2}
            onClick={() => setShowMenu(true)}
          />
        </Link>
      )}
      <Menu open={showMenu} onClose={() => setShowMenu(false)} />
      {children}
    </div>
  );
};

export default Layout;
