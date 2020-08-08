import React from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';

const SettingsCorner: React.FC = () => (
  <Link to="/settings" className="settings-corner">
    <Icon icon="cogs fa-2x" />
  </Link>
);

export default SettingsCorner;
