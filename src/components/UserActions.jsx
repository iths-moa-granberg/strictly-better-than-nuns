import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import PaceButtons from './PaceButtons';
import ConfirmButtons from './ConfirmButtons';

const UserActions = ({ actionState, setActionState, myPlayer, currentPlayerId, setMyPlayer }) => {
  const [paceProps, setPaceProps] = useState({});

  useEffect(() => {
    const onPlayersTurn = ({ resetPosition, caughtPlayers }) => {
      if (resetPosition) {
        setMyPlayer({ ...myPlayer, position: resetPosition });
      }
      setPaceProps({ playersTurn: true, caught: caughtPlayers.includes(myPlayer.id) });
    };

    socket.on('players turn', onPlayersTurn);

    return () => {
      socket.off('players turn', onPlayersTurn);
    };
  }, [myPlayer, setMyPlayer]);

  return (
    <div className="user-actions-wrapper">
      {actionState === 'pace' && <PaceButtons myPlayer={myPlayer} {...paceProps} />}
      {actionState === 'confirm' && <ConfirmButtons myPlayer={myPlayer} setActionState={setActionState} />}
      {actionState === 'select token' && <p>click on soundtoken to select sound-position</p>}
    </div>
  );
};

export default UserActions;
