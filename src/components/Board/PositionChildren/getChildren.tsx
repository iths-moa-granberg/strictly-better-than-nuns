import React from 'react';
import { MyPlayer } from '../../../clientTypes';
import { Position, SightToken, SoundToken, VisiblePlayers } from '../../../shared/sharedTypes';
import { ClientPlayer } from '../../../modules/player';
import Token from './Token/Token';

const getChildren = (
  position: Position,
  myPlayer: MyPlayer,
  visiblePlayers: VisiblePlayers,
  soundTokens: SoundToken[],
  sightTokens: SightToken[]
) => {
  const children: JSX.Element[] = [];

  if (!myPlayer.isEvil) {
    const goodPlayer = myPlayer as ClientPlayer;
    if (position.id === goodPlayer.position.id) {
      children.push(<div className="myEmptyPlayer" key={children.length} />);
    }
    visiblePlayers = visiblePlayers.filter((player) => player.id !== goodPlayer.id);
  }
  for (let player of visiblePlayers) {
    if (position.id === player.position.id) {
      children.push(<div className="emptyPlayer" key={children.length} />);
    }
  }
  if (soundTokens.find((token) => token.id === position.id)) {
    children.push(<Token type={'sound'} key={children.length} />);
  }
  if (sightTokens.find((token) => token.id === position.id)) {
    children.push(<Token type={'sight'} key={children.length} />);
  }

  return children;
};

export default getChildren;
