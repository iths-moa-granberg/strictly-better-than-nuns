import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { socket } from '../../../App';

import PaceButtons from './PaceButtons/PaceButtons';
import ConfirmButtons from './ConfirmButtons/ConfirmButtons';
import SelectEnemyButtons from './SelectEnemyButtons/SelectEnemyButtons';
import SelectPathButtons from './SelectPathButtons/SelectPathButtons';

import { OnSelectEnemy, OnPlayersTurn, OnPlayersFirstTurn } from '../../../shared/sharedTypes';
import { ActionState, MyPlayer } from '../../../clientTypes';
import ClientPlayer from '../../../modules/clientPlayer';

import styles from './UserActions.module.scss';

interface UserActionProps {
  readonly actionState: ActionState;
  readonly setActionState: (actionState: ActionState) => void;
  readonly myPlayer: MyPlayer;
  readonly currentPlayerID: 'e1' | 'e2' | null;
  readonly setMyPlayer: Dispatch<SetStateAction<MyPlayer | null>>;
  readonly setCurrentPlayerId: (id: 'e1' | 'e2' | null) => void;
}

interface PaceProps {
  readonly playersTurn: boolean;
  readonly caught: boolean;
  readonly firstTurn?: boolean;
}

const UserActions = ({
  actionState,
  setActionState,
  myPlayer,
  currentPlayerID,
  setMyPlayer,
  setCurrentPlayerId,
}: UserActionProps) => {
  const [paceProps, setPaceProps] = useState<PaceProps>({ playersTurn: false, caught: false });

  const selectEnemyHandler = useCallback(
    (enemyID: 'e1' | 'e2') => {
      setCurrentPlayerId(enemyID);
      const params: OnSelectEnemy = { enemyID };
      socket.emit('select enemy', params);
      setActionState({ key: 'pace' });
    },
    [setActionState, setCurrentPlayerId]
  );

  useEffect(() => {
    const onNextEnemyTurn = () => {
      selectEnemyHandler(currentPlayerID === 'e1' ? 'e2' : 'e1');
    };

    socket.on('next enemy turn', onNextEnemyTurn);

    return () => {
      socket.off('next enemy turn', onNextEnemyTurn);
    };
  }, [currentPlayerID, selectEnemyHandler]);

  useEffect(() => {
    const onPlayersTurn = ({ resetPosition, caughtPlayers }: OnPlayersTurn) => {
      setActionState({ key: 'pace' });
      if (resetPosition) {
        setMyPlayer({ ...myPlayer, position: resetPosition });
      }
      if (myPlayer.isEvil) {
        setPaceProps({ playersTurn: true, caught: false });
      } else {
        setPaceProps({ playersTurn: true, caught: caughtPlayers.includes((myPlayer as ClientPlayer).id) });
      }
    };

    const onEnemyTurn = () => {
      setActionState({ key: 'select enemy' });
      setPaceProps({ playersTurn: false, caught: false });
    };

    const onPlayersFirstTurn = ({ resetPosition }: OnPlayersFirstTurn) => {
      if (resetPosition) {
        setMyPlayer({ ...myPlayer, position: resetPosition });
      }
      setActionState({ key: 'players first turn' });
      setPaceProps({ caught: false, playersTurn: true, firstTurn: true });
    };

    socket.on('players turn', onPlayersTurn);
    socket.on('enemy turn', onEnemyTurn);
    socket.on('players first turn', onPlayersFirstTurn);

    return () => {
      socket.off('players turn', onPlayersTurn);
      socket.off('enemy turn', onEnemyTurn);
      socket.off('players first turn');
    };
  }, [myPlayer, setMyPlayer, setActionState]);

  return (
    <section className={styles.userActionsWrapper}>
      {actionState.key === 'players first turn' && <PaceButtons myPlayer={myPlayer} {...paceProps} />}
      {actionState.key === 'pace' && <PaceButtons myPlayer={myPlayer} {...paceProps} />}
      {actionState.key === 'confirm' && (
        <ConfirmButtons myPlayer={myPlayer} setActionState={setActionState} disabled={false} />
      )}
      {actionState.key === 'disabled enemy confirm' && (
        <ConfirmButtons myPlayer={myPlayer} setActionState={setActionState} disabled={true} />
      )}
      {actionState.key === 'select token' && <h1>Click on soundtoken to select sound-position</h1>}
      {actionState.key === 'select enemy' &&
        (myPlayer.isEvil ? (
          <SelectEnemyButtons selectEnemyHandler={selectEnemyHandler} />
        ) : (
          <h1>Waiting for your turn</h1>
        ))}
      {actionState.key === 'select new path' && (
        <SelectPathButtons {...actionState.params!} setActionState={setActionState} />
      )}
      {actionState.key === 'select initial paths' && (
        <SelectPathButtons setActionState={setActionState} {...actionState.params!} />
      )}
      {actionState.key === 'waiting' && <h1>Waiting for your turn</h1>}
    </section>
  );
};

export default UserActions;
