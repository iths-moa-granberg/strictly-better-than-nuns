import React, { useState, useEffect } from 'react';
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
import paths from './paths/pathIndex';
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
  const [e1Path, setE1Path] = useState<string>('');
  const [e2Path, setE2Path] = useState<string>('');
  const [reachablePositions, setReachablePositions] = useState<Position[]>([]);

  const [possiblePaths, setPossiblePaths] = useState<string[]>([]);

  const positionsArray: Position[] = Object.values(positions);

  const [viewLock, setViewLock] = useState<'locked' | 'unlocked'>(myPlayer.isEvil ? 'unlocked' : 'locked');

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

    socket.on('choose new path', ({ pathNames }: OnChooseNewPath) => {
      setActionState({ key: 'select new path', params: { pathNames } });
      setPossiblePaths(pathNames);
    });
  }, []);

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
  if (!myPlayer || !visiblePlayers.length || !e1Path || !e2Path) {
    return <>loading</>;
  }

  const Enemy1PathComp = paths[getPathComponentName(e1Path)];
  const Enemy2PathComp = paths[getPathComponentName(e2Path)];

  return (
    <>
      <section className={`${styles.boardWrapper} ${styles[viewLock]}`}>
        {actionState.key === 'select new path' ? (
          possiblePaths.map((pathName) => {
            const Comp = paths[getPathComponentName(pathName)];
            return <Comp className={styles.path} key={pathName} />;
          })
        ) : (
          <>
            <Enemy1PathComp className={styles.enemy1Path} />
            <Enemy2PathComp className={styles.enemy2Path} />
          </>
        )}

        {positionsArray.map((position) => {
          const children = getChildren(position, myPlayer, visiblePlayers, soundTokens, sightTokens);

          const className = myPlayer.isEvil
            ? getClassName(position, reachablePositions, currentPlayerID as 'e1' | 'e2')
            : getClassName(position, reachablePositions, (myPlayer as ClientPlayer).id);

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

const Player = ({ playerId, direction }: { playerId: string; direction?: string }) => {
  if (isNaN(Number(playerId)) && direction) {
    return (
      <div className={styles.enemyPlayerWrapper}>
        <div className={`${styles.triangle} ${styles[direction]} ${styles[`${playerId.toString()}`]}`} />
        <div className={`${styles.player} ${styles[`${playerId.toString()}`]}`} />
      </div>
    );
  }
  return <div className={`${styles.player} ${styles[`${playerId.toString()}`]}`} />;
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
      children.push(
        <Player playerId={player.id} key={children.length} direction={player.direction ? player.direction : ''} />
      );
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

const getClassName = (position: Position, reachablePositions: Position[], id: string) => {
  const className = ['position'];

  if (reachablePositions.find((pos) => pos.id === position.id)) {
    className.push(`reachable-${id}`);
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

const getPathComponentName = (str: string) => {
  return `${str.charAt(0).toUpperCase() + str.slice(1)}`.substring(0, str.length - 1);
};

export default Board;
