import React, { ReactElement, useState } from 'react';
import { useGlobalState } from '../state/appState';
import TargetRow from '../components/settings/TargetRow';
import ObsSettings from '../components/settings/ObsSettings';
import SettingsLayout from '../components/settings/SettingsLayout';

const TargetsSettingsPage: React.FC = () => {
  const [{ config }] = useGlobalState();

  const [settingsPane, setSettingsPane] = useState<ReactElement>();

  if (!config.config) {
    return <>Loading...</>;
  }

  return (
    <SettingsLayout>
      <main className="targets-settings">
        <div className="targets-list">
          <TargetRow
            name="OBS Studio"
            onClick={() =>
              setSettingsPane(
                <ObsSettings
                  config={config.config?.targets.obs}
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
    </SettingsLayout>
  );
};

export default TargetsSettingsPage;
