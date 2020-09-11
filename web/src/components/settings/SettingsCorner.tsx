import React from 'react';
import Icon from '../Icon';
import { Link } from 'react-router-dom';

const SettingsCorner: React.FC = () => (
  <Link to="/settings" className="settings-corner">
    <Icon icon="cogs" size={2} />
  </Link>
);

export default SettingsCorner;
