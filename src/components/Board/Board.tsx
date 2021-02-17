import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../../App';

import { getClassName, stepIsValid } from './boardUtils';
import positions from '../../shared/positions';

import Homes from './Homes/Homes';
import getChildren from './PositionChildren/getChildren';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import BoardPosition from './BoardPosition/BoardPosition';
import UserActions from './UserActions/UserActions';
import Layers from './Layers/Layers';
import Players from './Players/Players';
import PathEndings from './PathEndings/PathEndings';

import { MyPlayer, ClientEnemies, ActionState } from '../../clientTypes';
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
  OnSelectInitialPaths,
} from '../../shared/sharedTypes';
import ClientPlayer from '../../modules/clientPlayer';

import styles from './Board.module.scss';

interface BoardProps {
  readonly myPlayer: MyPlayer;
  readonly setMyPlayer: Dispatch<SetStateAction<MyPlayer | null>>;
  readonly currentPlayerID: 'e1' | 'e2' | null;
  readonly setCurrentPlayerID: (id: 'e1' | 'e2' | null) => void;
}

interface ClickStateParams {
  turn: 'player' | 'enemy';
  enemyID: 'e1' | 'e2';
  sound: number;
  heardTo: SoundToken[];
}

const Board = ({ myPlayer, setMyPlayer, currentPlayerID, setCurrentPlayerID }: BoardProps) => {
  const [actionState, setActionState] = useState<ActionState>({ key: 'pace' });
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
    const onUpdateBoard = ({
      visiblePlayers,
      soundTokens,
      sightTokens,
      enemyPaths,
      reachablePositions,
    }: OnUpdateBoard) => {
      setVisiblePlayers(visiblePlayers);
      setSoundTokens(soundTokens);
      setSightTokens(sightTokens);
      setE1Path(enemyPaths[0]);
      setE2Path(enemyPaths[1]);
      setReachablePositions(reachablePositions);
    };

    const onChooseNewPath = ({ pathNames }: OnChooseNewPath) => {
      setActionState({ key: 'select new path', params: { pathNames } });
      setPossiblePaths(pathNames);
    };

    socket.on('update board', onUpdateBoard);
    socket.on('choose new path', onChooseNewPath);

    return () => {
      socket.off('update board', onUpdateBoard);
      socket.off('choose new path', onChooseNewPath);
    };
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
      if (myPlayer.isEvil) {
        setActionState({ key: 'waiting' });
      }

      if (id === (myPlayer as ClientPlayer).id) {
        setSoundTokens(heardTo);
        setClickState({ key: 'select token', params: { turn, heardTo, enemyID, sound } });
        setActionState({ key: 'select token' });
      }
    };

    const onSelectInitialPaths = ({ pathNames }: OnSelectInitialPaths) => {
      if (myPlayer.isEvil) {
        setActionState({
          key: 'select initial paths',
          params: { pathNames, selectInitial: true },
        });
        setPossiblePaths(pathNames);
      }
    };

    socket.on('possible steps', onPossibleSteps);
    socket.on('player select token', onPlayerSelectToken);
    socket.on('select initial paths', onSelectInitialPaths);

    return () => {
      socket.off('possible steps', onPossibleSteps);
      socket.off('player select token', onPlayerSelectToken);
      socket.off('select initial paths', onSelectInitialPaths);
    };
  }, [myPlayer]);

  const clickHandler = (position: Position) => {
    if (clickState.key === 'take step' && stepIsValid(myPlayer, currentPlayerID, position, reachablePositions)) {
      if (myPlayer.isEvil) {
        setActionState({ key: 'disabled enemy confirm' });
        const params: OnEnemyTakesStep = { position };
        socket.emit('enemy takes step', params);
        setMyPlayer((prevState: MyPlayer | null) => {
          const prevClientEnemies = prevState as ClientEnemies;
          const newMyPlayer = { ...prevClientEnemies };
          newMyPlayer[currentPlayerID!] = { ...prevClientEnemies[currentPlayerID!], position };
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
        setClickState({ key: '' });
      }
    }
  };

  if (!myPlayer || !visiblePlayers.length) {
    return <LoadingScreen />;
  }

  return (
    <>
      <section className={styles.boardWrapper}>
        <Homes />

        <article className={styles.backgroundImageWrapper}>
          <img src={require('../../assets/Board.svg')} alt="background" className={styles.backgroundImage} />
        </article>

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
              children={getChildren(position, myPlayer, visiblePlayers, soundTokens, sightTokens, actionState.key)}
              clickHandler={clickHandler}
            />
          ))}
        </article>

        <PathEndings e1Path={e1Path} e2Path={e2Path} />

        <Players players={visiblePlayers} myPlayer={myPlayer} currentEnemyID={currentPlayerID} />
      </section>

      <UserActions
        actionState={actionState}
        setActionState={setActionState}
        currentPlayerID={currentPlayerID}
        myPlayer={myPlayer}
        setMyPlayer={setMyPlayer}
        setCurrentPlayerID={setCurrentPlayerID}
      />
    </>
  );
};

export default Board;
