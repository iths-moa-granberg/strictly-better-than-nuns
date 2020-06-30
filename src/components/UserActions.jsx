import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../App';
import PaceButtons from './PaceButtons';
import ConfirmButtons from './ConfirmButtons';
import SelectEnemyButtons from './SelectEnemyButtons';

const UserActions = ({ actionState, setActionState, myPlayer, currentPlayerId, setMyPlayer, setCurrentPlayerId }) => {
  const [paceProps, setPaceProps] = useState({});

  const selectEnemyHandler = useCallback(
    (enemyID) => {
      setCurrentPlayerId(enemyID);
      socket.emit('select enemy', { enemyID });
      setActionState('pace');
    },
    [setActionState, setCurrentPlayerId]
  );

  useEffect(() => {
    const onPlayersTurn = ({ resetPosition, caughtPlayers }) => {
      setActionState('pace');
      if (resetPosition) {
        setMyPlayer({ ...myPlayer, position: resetPosition });
      }
      setPaceProps({ playersTurn: true, caught: caughtPlayers.includes(myPlayer.id) });
    };

    const onEnemyTurn = () => {
      setActionState('select enemy');
      setPaceProps({ playersTurn: false, caught: false });
    };

    const onNextEnemyTurn = () => {
      selectEnemyHandler(currentPlayerId === 'e1' ? 'e2' : 'e1');
    };

    socket.on('players turn', onPlayersTurn);
    socket.on('enemy turn', onEnemyTurn);
    socket.on('next enemy turn', onNextEnemyTurn);

    return () => {
      socket.off('players turn', onPlayersTurn);
      socket.off('enemy turn', onEnemyTurn);
      socket.off('next enemy turn', onNextEnemyTurn);
    };
  }, [myPlayer, setMyPlayer, setActionState, currentPlayerId, selectEnemyHandler]);

  return (
    <div className="user-actions-wrapper">
      {actionState === 'pace' && <PaceButtons myPlayer={myPlayer} {...paceProps} />}
      {actionState === 'confirm' && <ConfirmButtons myPlayer={myPlayer} setActionState={setActionState} />}
      {actionState === 'select token' && <p>click on soundtoken to select sound-position</p>}
      {actionState === 'select enemy' &&
        (myPlayer.isEvil ? (
          <SelectEnemyButtons selectEnemyHandler={selectEnemyHandler} />
        ) : (
          <PaceButtons myPlayer={myPlayer} {...paceProps} />
        ))}
    </div>
  );
};

export default UserActions;
