import React from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';

export interface Props {
  editing?: boolean;
}

const DeckPage: React.FC<Props> = ({ editing }) => (
  <ButtonGrid rowCount={3} columnCount={5} editing={editing} />
);

export default DeckPage;
