import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import positions from '../modules/positions';
import Position from './Position';
import UserActions from './UserActions';

const Board = ({ myPlayer, setMyPlayer, currentPlayerId, setCurrentPlayerId }) => {
  const [actionState, setActionState] = useState('pace');
  const [clickState, setClickState] = useState({ key: '', params: {} });

  const [players, setPlayers] = useState(null);
  const [soundTokens, setSoundTokens] = useState(null);
  const [sightTokens, setSightTokens] = useState(null);
  const [e1Path, setE1Path] = useState(null);
  const [e2Path, setE2Path] = useState(null);
  const [reachablePositions, setReachablePositions] = useState(null);

  const positionsArray = Object.values(positions);

  useEffect(() => {
    socket.on('update board', ({ players, soundTokens, sightTokens, enemyPaths, reachablePositions }) => {
      setPlayers(players);
      setSoundTokens(soundTokens);
      setSightTokens(sightTokens);
      setE1Path(enemyPaths[0]);
      setE2Path(enemyPaths[1]);
      setReachablePositions(reachablePositions);
    });
  }, []);

  useEffect(() => {
    const onPossibleSteps = ({ possibleSteps, stepsLeft }) => {
      if ((myPlayer.isEvil && stepsLeft <= 1) || (!myPlayer.isEvil && !possibleSteps.length)) {
        setActionState('confirm');
      }
      setReachablePositions(possibleSteps);
      setClickState({ key: 'take step' });
    };

    const onPlayerSelectToken = ({ heardTo, id, turn, enemyID, sound }) => {
      if (id === myPlayer.id) {
        setSoundTokens(heardTo);
        setClickState({ key: 'select token', params: { turn, heardTo, enemyID, sound } });
        setActionState('select token');
      }
    };

    socket.on('possible steps', onPossibleSteps);
    socket.on('player select token', onPlayerSelectToken);

    return () => {
      socket.off('possible steps', onPossibleSteps);
      socket.off('player select token', onPlayerSelectToken);
    };
  }, [myPlayer]);

  const clickHandler = (position) => {
    if (clickState.key === 'take step' && stepIsValid(myPlayer, currentPlayerId, position, reachablePositions)) {
      if (myPlayer.isEvil) {
        socket.emit('enemy takes step', { position });
        setMyPlayer((mp) => {
          const newMyPlayer = { ...mp };
          newMyPlayer[currentPlayerId] = { ...mp[currentPlayerId], position };
          return newMyPlayer;
        });
      } else {
        socket.emit('player takes step', { position });
        setMyPlayer({ ...myPlayer, position });
        setActionState('confirm');
      }
    }
    if (clickState.key === 'select token') {
      const { turn, enemyID, sound, heardTo } = clickState.params;

      if (heardTo.find((pos) => pos.id === position.id)) {
        setSoundTokens([position]);
        setActionState('');
        socket.emit('player placed token', { position, turn, enemyID, sound });
      }
    }
  };

  if (!myPlayer || !players || !soundTokens || !sightTokens || !e1Path || !e2Path || !reachablePositions) {
    return <>loading</>;
  }

  return (
    <>
      <section className="board-wrapper">
        {positionsArray.map((position) => {
          const children = getChildren(position, myPlayer, players, soundTokens, sightTokens);
          const className = getClassName(position, e1Path, e2Path, reachablePositions);
          return (
            <Position
              key={position.id}
              position={position}
              className={className}
              children={children}
              clickHandler={clickHandler}
            />
          );
        })}
      </section>
      <UserActions
        actionState={actionState}
        setActionState={setActionState}
        currentPlayerId={currentPlayerId}
        myPlayer={myPlayer}
        setMyPlayer={setMyPlayer}
        setCurrentPlayerId={setCurrentPlayerId}
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

const getChildren = (position, myPlayer, players, soundTokens, sightTokens) => {
  const children = [];

  if (!myPlayer.isEvil) {
    if (position.id === myPlayer.position.id) {
      children.push(<Player playerId={myPlayer.id} key={children.length} />);
    }
  }
  for (let player of players) {
    if (position.id === player.position.id) {
      children.push(<Player playerId={player.id} key={children.length} />);
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

const getClassName = (position, e1Path, e2Path, reachablePositions) => {
  let className = 'position';

  if (e1Path.find((enemyPos) => enemyPos.id === position.id)) {
    className = `${className} enemy1-path`;
  }
  if (e2Path.find((enemyPos) => enemyPos.id === position.id)) {
    className = `${className} enemy2-path`;
  }
  if (reachablePositions.find((pos) => pos.id === position.id)) {
    className = `${className} reachable`;
  }

  return className;
};

const stepIsValid = (myPlayer, currentPlayerId, position, possibleSteps) => {
  if (myPlayer.isEvil) {
    return (
      myPlayer[currentPlayerId].position.neighbours.includes(position.id) &&
      possibleSteps.find((pos) => pos.id === position.id)
    );
  }
  return myPlayer.position.neighbours.includes(position.id) && possibleSteps.find((pos) => pos.id === position.id);
};

export default Board;
