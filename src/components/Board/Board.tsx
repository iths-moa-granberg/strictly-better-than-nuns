import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../../App';
import positions from '../../shared/positions';
import BoardPosition from './BoardPosition/BoardPosition';
import UserActions from './UserActions/UserActions';
import { MyPlayer, ActionStateParams, ClientEnemies } from '../../clientTypes';
import {
  Position,
  OnUpdateBoard,
  SightToken,
  SoundToken,
  OnPlayerSelectToken,
  VisiblePlayers,
  OnChooseNewPath,
  OnPossibleSteps,
  OnEnemyTakesStep,
  OnPlayerTakesStep,
  OnPlayerPlacedToken,
} from '../../shared/sharedTypes';
import { ClientPlayer } from '../../modules/player';
import styles from './Board.module.scss';

interface BoardProps {
  myPlayer: MyPlayer;
  setMyPlayer: Function;
  currentPlayerID: 'e1' | 'e2' | null;
  setCurrentPlayerId: Function;
}

interface ClickStateParams {
  turn: 'player' | 'enemy';
  enemyID: 'e1' | 'e2';
  sound: number;
  heardTo: SoundToken[];
}

const Board = ({ myPlayer, setMyPlayer, currentPlayerID, setCurrentPlayerId }: BoardProps) => {
  const [actionState, setActionState] = useState<{ key: string; params?: ActionStateParams }>({
    key: 'pace',
  });
  const [clickState, setClickState] = useState<{ key: string; params?: ClickStateParams }>({ key: '' });

  const [visiblePlayers, setVisiblePlayers] = useState<VisiblePlayers>([]);
  const [soundTokens, setSoundTokens] = useState<SoundToken[]>([]);
  const [sightTokens, setSightTokens] = useState<SightToken[]>([]);
  const [e1Path, setE1Path] = useState<Position[]>([]);
  const [e2Path, setE2Path] = useState<Position[]>([]);
  const [reachablePositions, setReachablePositions] = useState<Position[]>([]);

  const positionsArray: Position[] = Object.values(positions);

  const [viewLock, setViewLock] = useState<'locked' | 'unlocked'>(myPlayer.isEvil ? 'unlocked' : 'locked');

  const showNewPathHandler = useCallback(
    (path: Position[]) => {
      if (currentPlayerID === 'e1') {
        setE1Path(path);
      } else {
        setE2Path(path);
      }
    },
    [currentPlayerID]
  );

  useEffect(() => {
    socket.on(
      'update board',
      ({ visiblePlayers, soundTokens, sightTokens, enemyPaths, reachablePositions }: OnUpdateBoard) => {
        setVisiblePlayers(visiblePlayers);
        setSoundTokens(soundTokens);
        setSightTokens(sightTokens);
        setE1Path(enemyPaths[0]);
        setE2Path(enemyPaths[1]);
        setReachablePositions(reachablePositions);
      }
    );
  }, []);

  useEffect(() => {
    const onChooseNewPath = ({ paths }: OnChooseNewPath) => {
      setActionState({ key: 'select new path', params: { paths, showNewPathHandler } });
    };

    socket.on('choose new path', onChooseNewPath);

    return () => {
      socket.off('choose new path', onChooseNewPath);
    };
  }, [showNewPathHandler]);

  useEffect(() => {
    if ((myPlayer as ClientPlayer).hasKey) {
      setViewLock('unlocked');
    }

    const onPossibleSteps = ({ possibleSteps, stepsLeft }: OnPossibleSteps) => {
      if ((myPlayer.isEvil && stepsLeft! <= 1) || (!myPlayer.isEvil && !possibleSteps.length)) {
        setActionState({ key: 'confirm' });
      }
      setReachablePositions(possibleSteps);
      setClickState({ key: 'take step' });
    };

    const onPlayerSelectToken = ({ heardTo, id, turn, enemyID, sound }: OnPlayerSelectToken) => {
      if (id === (myPlayer as ClientPlayer).id) {
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

  const clickHandler = (position: Position) => {
    if (clickState.key === 'take step' && stepIsValid(myPlayer, currentPlayerID, position, reachablePositions)) {
      if (myPlayer.isEvil) {
        setActionState({ key: 'disabled enemy confirm' });
        const params: OnEnemyTakesStep = { position };
        socket.emit('enemy takes step', params);
        setMyPlayer((mp: ClientEnemies) => {
          const newMyPlayer = { ...mp };
          newMyPlayer[currentPlayerID!] = { ...mp[currentPlayerID!], position };
          return newMyPlayer;
        });
      } else {
        const params: OnPlayerTakesStep = { position };
        socket.emit('player takes step', params);
        setMyPlayer({ ...myPlayer, position });
        setActionState({ key: 'confirm' });
      }
    }
    if (clickState.key === 'select token') {
      const { turn, enemyID, sound, heardTo } = clickState.params!;

      if (heardTo!.find((pos) => pos.id === position.id)) {
        const params: OnPlayerPlacedToken = { position, turn, enemyID, sound };
        socket.emit('player placed token', params);
      }
    }
  };

  if (!myPlayer || !visiblePlayers.length || !e1Path.length || !e2Path.length) {
    return <>loading</>;
  }

  return (
    <>
      <section className={`${styles.boardWrapper} ${styles[viewLock]}`}>
        {positionsArray.map((position) => {
          const children = getChildren(position, myPlayer, visiblePlayers, soundTokens, sightTokens);
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
        currentPlayerID={currentPlayerID}
        myPlayer={myPlayer}
        setMyPlayer={setMyPlayer}
        setCurrentPlayerId={setCurrentPlayerId}
      />
    </>
  );
};

const Player = ({ playerId }: { playerId: number | string }) => {
  return <div className={`player player-${playerId.toString()}`} />;
};

const Token = ({ type }: { type: 'sight' | 'sound' }) => {
  return <div className={`${type}-token`} />;
};

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
      children.push(<Player playerId={goodPlayer.id} key={children.length} />);
    }
    visiblePlayers = visiblePlayers.filter((player) => player.id !== goodPlayer.id);
  }
  for (let player of visiblePlayers) {
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

const getClassName = (position: Position, e1Path: Position[], e2Path: Position[], reachablePositions: Position[]) => {
  const className = ['position'];

  if (e1Path[e1Path.length - 1].id === position.id) {
    className.push('enemy1-end-of-path');
  }
  if (e2Path[e2Path.length - 1].id === position.id) {
    className.push('enemy2-end-of-path');
  }

  if (reachablePositions.find((pos) => pos.id === position.id)) {
    className.push('reachable');
  }

  return className;
};

const stepIsValid = (
  myPlayer: MyPlayer,
  currentPlayerID: 'e1' | 'e2' | null,
  position: Position,
  possibleSteps: Position[]
) => {
  if (myPlayer.isEvil) {
    return (
      (myPlayer as ClientEnemies)[currentPlayerID!].position.neighbours.includes(position.id) &&
      possibleSteps.find((pos) => pos.id === position.id)
    );
  }
  return (
    (myPlayer as ClientPlayer).position.neighbours.includes(position.id) &&
    possibleSteps.find((pos) => pos.id === position.id)
  );
};

export default Board;
