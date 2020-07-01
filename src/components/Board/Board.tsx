import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../../App';
import positions from '../../shared/positions';
import BoardPosition from './BoardPosition/BoardPosition';
import UserActions from './UserActions/UserActions';
import { MyPlayer } from '../../clientTypes';
import {
  Position,
  OnUpdateBoard,
  SightToken,
  SoundToken,
  OnPlayerSelectToken,
  Players,
} from '../../shared/sharedTypes';

interface BoardProps {
  myPlayer: MyPlayer;
  setMyPlayer: Function;
  currentPlayerId: 'e1' | 'e2' | null;
  setCurrentPlayerId: Function;
}

const Board = ({ myPlayer, setMyPlayer, currentPlayerId, setCurrentPlayerId }: BoardProps) => {
  const [actionState, setActionState] = useState<{ key: string; params?: Object }>({ key: 'pace', params: {} });
  const [clickState, setClickState] = useState<{ key: string; params?: Object }>({ key: '', params: {} });

  const [players, setPlayers] = useState<Players>([]);
  const [soundTokens, setSoundTokens] = useState<SoundToken[]>([]);
  const [sightTokens, setSightTokens] = useState<SightToken[]>([]);
  const [e1Path, setE1Path] = useState<Position[]>([]);
  const [e2Path, setE2Path] = useState<Position[]>([]);
  const [reachablePositions, setReachablePositions] = useState<Position[]>([]);

  const positionsArray = Object.values(positions);

  const showNewPathHandler = useCallback(
    (path) => {
      if (currentPlayerId === 'e1') {
        setE1Path(path);
      } else {
        setE2Path(path);
      }
    },
    [currentPlayerId]
  );

  useEffect(() => {
    socket.on(
      'update board',
      ({ players, soundTokens, sightTokens, enemyPaths, reachablePositions }: OnUpdateBoard) => {
        setPlayers(players);
        setSoundTokens(soundTokens);
        setSightTokens(sightTokens);
        setE1Path(enemyPaths[0]);
        setE2Path(enemyPaths[1]);
        setReachablePositions(reachablePositions);
      }
    );
  }, []);

  useEffect(() => {
    const onChooseNewPath = ({ paths }) => {
      setActionState({ key: 'select new path', params: { paths, showNewPathHandler } });
    };

    socket.on('choose new path', onChooseNewPath);

    return () => {
      socket.off('choose new path', onChooseNewPath);
    };
  }, [showNewPathHandler]);

  useEffect(() => {
    const onPossibleSteps = ({ possibleSteps, stepsLeft }) => {
      if ((myPlayer.isEvil && stepsLeft <= 1) || (!myPlayer.isEvil && !possibleSteps.length)) {
        setActionState({ key: 'confirm' });
      }
      setReachablePositions(possibleSteps);
      setClickState({ key: 'take step' });
    };

    const onPlayerSelectToken = ({ heardTo, id, turn, enemyID, sound }: OnPlayerSelectToken) => {
      if (id === myPlayer.id) {
        setSoundTokens(heardTo);
        setClickState({ key: 'select token', params: { turn, heardTo, enemyID, sound } });
        setActionState({ key: 'select token' });
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
        setActionState({ key: 'confirm' });
      }
    }
    if (clickState.key === 'select token') {
      const { turn, enemyID, sound, heardTo } = clickState.params;

      if (heardTo.find((pos) => pos.id === position.id)) {
        setSoundTokens([position]);
        setActionState({ key: '' });
        socket.emit('player placed token', { position, turn, enemyID, sound });
      }
    }
  };

  if (!myPlayer || !players.length || !e1Path.length || !e2Path.length) {
    return <>loading</>;
  }

  return (
    <>
      <section className="board-wrapper">
        {positionsArray.map((position) => {
          const children = getChildren(position, myPlayer, players, soundTokens, sightTokens);
          const className = getClassName(position, e1Path, e2Path, reachablePositions);
          return (
            <BoardPosition
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
