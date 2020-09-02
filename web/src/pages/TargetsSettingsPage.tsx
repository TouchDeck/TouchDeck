import React from 'react';
import { useGlobalState } from '../state/appState';
import TargetRow from '../components/TargetRow';
import ObsSettings from '../components/settings/ObsSettings';

const TargetsSettingsPage: React.FC = () => {
  const [state, setState] = useGlobalState();
  const { config } = state;

  if (config.loading) {
    return <>Loading...</>;
  }

  return (
    <div className="targets-settings">
      <main>
        <div className="targets-list">
          <TargetRow name="OBS" />
        </div>
        <div className="target-settings">
          <ObsSettings
            config={config.config.targets.obs}
            onSaveConfig={(newConfig) => {
              // TODO
              console.log(newConfig);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default TargetsSettingsPage;
