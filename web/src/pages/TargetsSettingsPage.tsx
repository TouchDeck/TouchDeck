import React, { useState } from 'react';
import { useGlobalState } from '../state/appState';
import TargetRow from '../components/settings/TargetRow';
import ObsSettings from '../components/settings/ObsSettings';
import SettingsLayout from '../components/settings/SettingsLayout';

const TargetsSettingsPage: React.FC = () => {
  const [{ config }] = useGlobalState();

  const [settingsPane, setSettingsPane] = useState();

  if (!config.config) {
    return <>Loading...</>;
  }

  return (
    <SettingsLayout>
      <div className="targets-settings">
        <main>
          <div className="targets-list">
            <TargetRow
              name="OBS Studio"
              onClick={() =>
                setSettingsPane(
                  <ObsSettings
                    config={config.config.targets.obs}
                    onSaveConfig={(newConfig) => {
                      // TODO
                      console.log(newConfig);
                    }}
                  />
                )
              }
            />
          </div>
          <div className="target-settings">{settingsPane}</div>
        </main>
      </div>
    </SettingsLayout>
  );
};

export default TargetsSettingsPage;
