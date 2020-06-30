import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../App';
import PaceButtons from './PaceButtons';
import ConfirmButtons from './ConfirmButtons';
import SelectEnemyButtons from './SelectEnemyButtons';
import SelectPathButtons from './SelectPathButtons';

const UserActions = ({ actionState, setActionState, myPlayer, currentPlayerId, setMyPlayer, setCurrentPlayerId }) => {
  const [paceProps, setPaceProps] = useState({});

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
      selectEnemyHandler(currentPlayerId === 'e1' ? 'e2' : 'e1');
    };

    socket.on('next enemy turn', onNextEnemyTurn);

    return () => {
      socket.off('next enemy turn', onNextEnemyTurn);
    };
  }, [currentPlayerId, selectEnemyHandler]);

  useEffect(() => {
    const onPlayersTurn = ({ resetPosition, caughtPlayers }) => {
      setActionState({ key: 'pace' });
      if (resetPosition) {
        setMyPlayer({ ...myPlayer, position: resetPosition });
      }
      setPaceProps({ playersTurn: true, caught: caughtPlayers.includes(myPlayer.id) });
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
      {actionState.key === 'select new path' && <SelectPathButtons {...actionState.params} />}
    </div>
  );
};

export default UserActions;
