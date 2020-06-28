import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import positions from '../modules/positions';
import Position from './Position';
import UserActions from './UserActions';

const Board = ({ myPlayer, setMyPlayer, currentPlayerId }) => {
  const [actionState, setActionState] = useState('pace');

  const [activePlayer, setActivePlayer] = useState(null);
  const [players, setPlayers] = useState(null);
  const [soundTokens, setSoundTokens] = useState(null);
  const [sightTokens, setSightTokens] = useState(null);
  const [e1Path, setE1Path] = useState(null);
  const [e2Path, setE2Path] = useState(null);
  const [reachablePositions, setReachablePositions] = useState(null);

  const positionsArray = Object.values(positions);

  useEffect(() => {
    const onUpdateBoard = ({ players, soundTokens, sightTokens, enemyPaths, reachablePositions }) => {
      setActivePlayer(myPlayer);
      setPlayers(players);
      setSoundTokens(soundTokens);
      setSightTokens(sightTokens);
      setE1Path(enemyPaths[0]);
      setE2Path(enemyPaths[1]);
      setReachablePositions(reachablePositions);
    };

    socket.on('update board', onUpdateBoard);

    return () => {
      socket.off('update board', onUpdateBoard);
    };
  }, [myPlayer]);

  if (!activePlayer || !players || !soundTokens || !sightTokens || !e1Path || !e2Path || !reachablePositions) {
    return <>loading</>;
  }

  return (
    <>
      <section className="board-wrapper">
        {positionsArray.map(position => {
          const children = getChildren(position, activePlayer, players, soundTokens, sightTokens);
          const className = getClassName(position, e1Path, e2Path, reachablePositions);
          return <Position key={position.id} position={position} className={className} children={children} />;
        })}
      </section>
      <UserActions
        actionState={actionState}
        currentPlayerId={currentPlayerId}
        myPlayer={myPlayer}
        setMyPlayer={setMyPlayer}
      />
    </>
  );
};

const Player = ({ playerId }) => {
  return <div className={`player player-${playerId.toString()}`} />;
};

const Token = ({ type }) => {
  return <div className={`${type}-token`} />;
};

const getChildren = (position, activePlayer, players, soundTokens, sightTokens) => {
  const children = [];

  if (!activePlayer.isEvil) {
    if (position.id === activePlayer.position.id) {
      children.push(<Player playerId={activePlayer.id} key={children.length} />);
    }
  }
  for (let player of players) {
    if (position.id === player.position.id) {
      children.push(<Player playerId={player.id} key={children.length} />);
    }
  }
  if (soundTokens.find(token => token.id === position.id)) {
    children.push(<Token type={'sound'} key={children.length} />);
  }
  if (sightTokens.find(token => token.id === position.id)) {
    children.push(<Token type={'sight'} key={children.length} />);
  }

  return children;
};

const getClassName = (position, e1Path, e2Path, reachablePositions) => {
  let className = 'position';

  if (e1Path.find(enemyPos => enemyPos.id === position.id)) {
    className = `${className} enemy1-path`;
  }
  if (e2Path.find(enemyPos => enemyPos.id === position.id)) {
    className = `${className} enemy2-path`;
  }
  if (reachablePositions.find(pos => pos.id === position.id)) {
    className = `${className} reachable`;
  }

  return className;
};

export default Board;
