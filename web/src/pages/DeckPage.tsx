import React, { useCallback, useEffect, useState } from 'react';
import { ButtonGrid } from '../components/buttons/ButtonGrid';
import ButtonList from '../components/buttons/ButtonList';
import { ButtonConfig } from 'touchdeck-model';
import { newButton } from '../util/newButton';
import EditButtonModal from '../components/buttons/EditButtonModal';
import { useConnectedAgent } from '../state/appState';

export interface Props {
  editing?: boolean;
}

export const DeckPage: React.FC<Props> = ({ editing }) => {
  const [selectedButton, setSelectedButton] = useState<ButtonConfig>();
  const { activeProfileId, config } = useConnectedAgent();
  const { layouts, profiles } = config;

  const findRootLayoutId = useCallback(
    (profileId: string): string => {
      const profile = profiles.find((p) => p.id === profileId)!;
      const layout = layouts.find((l) => l.id === profile.rootLayout)!;
      return layout.id;
    },
    [layouts, profiles]
  );

  const [rootLayout, setRootLayout] = useState(() =>
    findRootLayoutId(activeProfileId)
  );

  useEffect(() => setRootLayout(findRootLayoutId(activeProfileId)), [
    activeProfileId,
    findRootLayoutId,
  ]);

  useEffect(() => {
    if (!editing) {
      setSelectedButton(undefined);
    }
  }, [editing]);

  return (
    <main className="deck">
      {editing && (
        <div className="edit-panel">
          <ButtonList
            onClickButton={setSelectedButton}
            onCreateActionButton={() => setSelectedButton(newButton('normal'))}
            onCreateFolder={() => setSelectedButton(newButton('folder'))}
          />
          {selectedButton && (
            <EditButtonModal
              button={selectedButton}
              onClose={() => setSelectedButton(undefined)}
            />
          )}
        </div>
      )}
      <ButtonGrid
        rowCount={3}
        columnCount={5}
        editing={editing}
        rootLayout={rootLayout}
      />
    </main>
  );
};
