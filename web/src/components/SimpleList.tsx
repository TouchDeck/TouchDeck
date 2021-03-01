import React, { ReactNode, useLayoutEffect, useState } from 'react';
import { List } from './List';
import { searchEntries } from '../util/searchEntries';

export interface Props<T> {
  children?: ReactNode;
  entries: T[];
  entryName: (entry: T) => string;
  entryPreviewUrl?: (entry: T) => string;
  onClickEntry: (entry: T) => void;
  searchPlaceholder: string;
}

export function SimpleList<T>({
  children,
  entries,
  entryName,
  entryPreviewUrl,
  onClickEntry,
  searchPlaceholder,
}: Props<T>) {
  const [showEntries, setShowEntries] = useState(entries);
  const [searchTerm, setSearchTerm] = useState('');

  useLayoutEffect(() => {
    setShowEntries(searchEntries(entries, searchTerm, entryName));
  }, [entries, searchTerm, entryName]);

  return (
    <List
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchPlaceholder={searchPlaceholder}
    >
      {children}
      <div className="entries">
        {showEntries.map((entry, i) => (
          <div key={i} className="entry" onClick={() => onClickEntry(entry)}>
            {entryPreviewUrl && (
              <div
                className="preview"
                style={{
                  backgroundImage: `url(${entryPreviewUrl(entry)})`,
                }}
              />
            )}
            <span className="name">{entryName(entry)}</span>
          </div>
        ))}
      </div>
    </List>
  );
}
