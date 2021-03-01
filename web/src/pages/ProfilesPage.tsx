import React, { useCallback, useState } from 'react';
import { useConnectedAgent } from '../state/appState';
import { SimpleList } from '../components/SimpleList';
import { Profile } from 'touchdeck-model';
import { ProfileProperties } from '../components/ProfileProperties';

export const ProfilesPage: React.FC = () => {
  const { config } = useConnectedAgent();
  const [selectedProfile, setSelectedProfile] = useState<Profile>();

  const deleteProfile = useCallback(async (profile: Profile) => {
    // TODO
    setSelectedProfile(undefined);
  }, []);

  return (
    <main className="profiles-page config-page">
      <SimpleList<Profile>
        searchPlaceholder="Search profiles..."
        entries={config.profiles}
        entryName={(p) => p.name}
        onClickEntry={setSelectedProfile}
      />
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
