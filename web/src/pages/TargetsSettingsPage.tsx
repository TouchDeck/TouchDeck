import React, { ReactElement, useCallback, useState } from 'react';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import TargetRow from '../components/settings/TargetRow';
import ObsSettings from '../components/settings/ObsSettings';
import SettingsLayout from '../components/settings/SettingsLayout';
import Configuration from '../model/configuration/Configuration';

const TargetsSettingsPage: React.FC = () => {
  const [, dispatch] = useGlobalState();
  const { agent, config } = useConnectedAgent();

  const [settingsPane, setSettingsPane] = useState<ReactElement>();

  const updateConfig = useCallback(
    (updated: Configuration) => {
      dispatch({ type: 'configLoading' });
      agent.setConfiguration(updated).then((newConfig) =>
        dispatch({
          type: 'configLoaded',
          config: newConfig,
        })
      );
    },
    [agent, dispatch]
  );

  return (
    <SettingsLayout>
      <main className="targets-settings">
        <div className="targets-list">
          <TargetRow
            name="OBS Studio"
            onClick={() =>
              setSettingsPane(
                <ObsSettings
                  onSaveConfig={(newConfig) =>
                    updateConfig({
                      ...config,
                      targets: { ...config.targets, obs: newConfig },
                    })
                  }
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
