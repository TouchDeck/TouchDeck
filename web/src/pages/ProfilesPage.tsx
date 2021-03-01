import React from 'react';
import { useConnectedAgent } from '../state/appState';
import { SimpleList } from '../components/SimpleList';
import { Profile } from 'touchdeck-model';

export const ProfilesPage: React.FC = () => {
  const { config } = useConnectedAgent();

  return (
    <main className="profiles-page config-page">
      <SimpleList<Profile>
        searchPlaceholder="Search profiles..."
        entries={config.profiles}
        entryName={(p) => p.name}
        onClickEntry={() => undefined}
      />
    </main>
  );
};
