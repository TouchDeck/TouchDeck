import React, { ReactElement, useCallback, useState } from 'react';
import { useAgent, useConfig, useGlobalState } from '../state/appState';
import TargetRow from '../components/settings/TargetRow';
import ObsSettings from '../components/settings/ObsSettings';
import SettingsLayout from '../components/settings/SettingsLayout';

const TargetsSettingsPage: React.FC = () => {
  const [, dispatch] = useGlobalState();
  const config = useConfig();
  const agent = useAgent();

  const [settingsPane, setSettingsPane] = useState<ReactElement>();

  const updateConfig = useCallback(() => {
    agent.setConfiguration(config).then((newConfig) =>
      dispatch({
        type: 'configLoaded',
        config: newConfig,
      })
    );
  }, [agent, config, dispatch]);

  return (
    <SettingsLayout>
      <main className="targets-settings">
        <div className="targets-list">
          <TargetRow
            name="OBS Studio"
            onClick={() =>
              setSettingsPane(
                <ObsSettings
                  config={config.targets.obs}
                  onSaveConfig={(newObsConfig) => {
                    config.targets.obs = newObsConfig;
                    updateConfig();
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
