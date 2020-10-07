import React, { useState, useEffect } from 'react';
import { socket } from '../../App';

import { getClassName, stepIsValid } from './boardUtils';
import positions from '../../shared/positions';
import homes from './homes/homeIndex';

import getChildren from './PositionChildren/getChildren';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import BoardPosition from './BoardPosition/BoardPosition';
import UserActions from './UserActions/UserActions';
import Layers from './Layers/Layers';

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
  const [e1Path, setE1Path] = useState<string>('');
  const [e2Path, setE2Path] = useState<string>('');
  const [reachablePositions, setReachablePositions] = useState<Position[]>([]);

  const [possiblePaths, setPossiblePaths] = useState<string[]>([]);

  const positionsArray: Position[] = Object.values(positions);

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

  if (!myPlayer || !visiblePlayers.length || !e1Path || !e2Path) {
    return <LoadingScreen />;
  }

  let Home = homes.Home0;
  if (!myPlayer.isEvil) {
    Home = homes[`Home${(myPlayer as ClientPlayer).id}`];
  }

  return (
    <>
      {!myPlayer.isEvil && <Home className={styles.home} />}

      <section className={styles.boardWrapper}>
        <Layers
          actionState={actionState}
          possiblePaths={possiblePaths}
          myPlayer={myPlayer}
          e1Path={e1Path}
          e2Path={e2Path}
        />

        <article className="board-position-wrapper">
          {positionsArray.map((position) => (
            <BoardPosition
              key={position.id}
              position={position}
              className={getClassName(myPlayer, currentPlayerID, position, reachablePositions)}
              children={getChildren(position, myPlayer, visiblePlayers, soundTokens, sightTokens)}
              clickHandler={clickHandler}
            />
          ))}
        </article>
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

export default Board;
