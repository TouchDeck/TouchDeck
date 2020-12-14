import React from 'react';
import classNames from '../util/classNames';
import TextInput from './input/TextInput';

export interface Props {
  className?: string;
  searchPlaceholder?: string;
  searchTerm?: string;
  onSearchTermChange?: (search: string) => void;
}

export const List: React.FC<Props> = ({
  children,
  className,
  searchPlaceholder,
  searchTerm,
  onSearchTermChange,
}) => (
  <div className={classNames(['list', className])}>
    {onSearchTermChange && (
      <TextInput
        className="search"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={onSearchTermChange}
        icon="search"
      />
    )}
    {children}
  </div>
);
