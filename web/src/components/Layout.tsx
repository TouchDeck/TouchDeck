import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Menu from './Menu';

const Layout: React.FC = ({ children }) => {
  const location = useLocation();
  // If the pathname is longer than 1 ('/'), default the menu to open.
  const [showMenu, setShowMenu] = useState(location.pathname.length > 1);

  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );

  useEffect(() => {
    // Subscribe to the fullscreen change event, so we can change the icon.
    document.addEventListener('fullscreenchange', () =>
      setIsFullscreen(!!document.fullscreenElement)
    );
  }, []);

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
      <Icon
        className="toggle-fullscreen"
        icon={isFullscreen ? 'compress-alt' : 'expand-alt'}
        size={2}
        onClick={() => {
          // Toggle fullscreen.
          // No need to await any of these promises since we don't handle the errors anyway.
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }}
      />
      {children}
    </div>
  );
};

export default Layout;
