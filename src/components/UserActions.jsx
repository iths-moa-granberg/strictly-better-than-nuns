import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import PaceButtons from './PaceButtons';

const UserActions = ({ actionState, myPlayer, currentPlayerId, setMyPlayer }) => {
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
    </div>
  );
};

export default UserActions;
