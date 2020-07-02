import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../../../App';
import PaceButtons from './PaceButtons/PaceButtons';
import ConfirmButtons from './ConfirmButtons/ConfirmButtons';
import SelectEnemyButtons from './SelectEnemyButtons/SelectEnemyButtons';
import SelectPathButtons from './SelectPathButtons/SelectPathButtons';
import { Position } from '../../../shared/sharedTypes';
import { ActionStateParams, MyPlayer } from '../../../clientTypes';
import { ClientPlayer } from '../../../modules/player';

interface UserActionProps {
  actionState: { key: string; params?: ActionStateParams };
  setActionState: Function;
  myPlayer: MyPlayer;
  currentPlayerID: 'e1' | 'e2' | null;
  setMyPlayer: Function;
  setCurrentPlayerId: Function;
}

interface PaceProps {
  playersTurn: boolean;
  caught: boolean;
}

const UserActions = ({
  actionState,
  setActionState,
  myPlayer,
  currentPlayerID,
  setMyPlayer,
  setCurrentPlayerId,
}: UserActionProps) => {
  const [paceProps, setPaceProps] = useState<PaceProps>({ playersTurn: true, caught: false });

  const selectEnemyHandler = useCallback(
    (enemyID) => {
      setCurrentPlayerId(enemyID);
      socket.emit('select enemy', { enemyID });
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
    const onPlayersTurn = ({
      resetPosition,
      caughtPlayers,
    }: {
      resetPosition: Position[];
      caughtPlayers: string[];
    }) => {
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

    socket.on('players turn', onPlayersTurn);
    socket.on('enemy turn', onEnemyTurn);

    return () => {
      socket.off('players turn', onPlayersTurn);
      socket.off('enemy turn', onEnemyTurn);
    };
  }, [myPlayer, setMyPlayer, setActionState]);

  return (
    <div className="user-actions-wrapper">
      {actionState.key === 'pace' && <PaceButtons myPlayer={myPlayer} {...paceProps} />}
      {actionState.key === 'confirm' && <ConfirmButtons myPlayer={myPlayer} setActionState={setActionState} />}
      {actionState.key === 'select token' && <p>click on soundtoken to select sound-position</p>}
      {actionState.key === 'select enemy' &&
        (myPlayer.isEvil ? (
          <SelectEnemyButtons selectEnemyHandler={selectEnemyHandler} />
        ) : (
          <PaceButtons myPlayer={myPlayer} {...paceProps} />
        ))}
      {actionState.key === 'select new path' && <SelectPathButtons {...actionState.params!} />}
    </div>
  );
};

export default UserActions;
