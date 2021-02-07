import React, { ReactElement, useCallback, useState } from 'react';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import ObsSettings from '../components/settings/ObsSettings';
import { Configuration } from 'touchdeck-model';
import { List } from '../components/List';

export const TargetsPage: React.FC = () => {
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
    <main className="targets-page config-page">
      <List className="targets-list">
        <div className="entries">
          <div
            className="entry"
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
          >
            <img
              className="preview"
              src="/logos/OBS_Studio.png"
              alt="OBS Studio logo"
            />
            <span className="name">OBS Studio</span>
          </div>
        </div>
      </List>
      <div className="target-settings properties">{settingsPane}</div>
    </main>
  );
};
