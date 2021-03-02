import React, { useCallback, useState } from 'react';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import { SimpleList } from '../components/SimpleList';
import { Configuration, Profile } from 'touchdeck-model';
import { ProfileProperties } from '../components/ProfileProperties';
import { Button } from '../components/Button';

export const ProfilesPage: React.FC = () => {
  const [, dispatch] = useGlobalState();
  const { agent, config } = useConnectedAgent();
  const [selectedProfile, setSelectedProfile] = useState<Profile>();

  const updateConfig = useCallback(
    async (newConfig: Configuration): Promise<void> => {
      dispatch({ type: 'configLoading' });
      const updatedConfig = await agent.setConfiguration(newConfig);
      dispatch({
        type: 'configLoaded',
        config: updatedConfig,
      });
    },
    [agent, dispatch]
  );

  const deleteProfile = useCallback(
    async (profile: Profile) => {
      if (profile.id) {
        await updateConfig({
          ...config,
          profiles: config.profiles.filter((p) => p.id !== profile.id),
        });
      }

      setSelectedProfile(undefined);
    },
    [config, updateConfig]
  );

  return (
    <main className="profiles-page config-page">
      <SimpleList<Profile>
        searchPlaceholder="Search profiles..."
        entries={config.profiles}
        entryName={(p) => p.name}
        onClickEntry={setSelectedProfile}
      >
        <Button
          icon="plus"
          positive
          onClick={() =>
            setSelectedProfile({ name: '', id: '', rootLayout: '' })
          }
        >
          Profile
        </Button>
      </SimpleList>
      {selectedProfile && (
        <ProfileProperties
          profile={selectedProfile}
          onDelete={() => deleteProfile(selectedProfile)}
          onClose={() => setSelectedProfile(undefined)}
          isDefaultProfile={selectedProfile.id === config.defaultProfile}
        />
      )}
    </main>
  );
};
