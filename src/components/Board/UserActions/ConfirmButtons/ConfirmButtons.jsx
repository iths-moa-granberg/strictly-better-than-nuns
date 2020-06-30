import React from 'react';
import { socket } from '../../../../App';

const ConfirmButtons = ({ myPlayer, setActionState }) => {
  const handleConfirm = () => {
    if (myPlayer.isEvil) {
      socket.emit('enemy move completed');
    } else {
      socket.emit('player move completed');
    }
  };

  const handleBack = () => {
    setActionState({ key: 'pace' });
    socket.emit('player reset move');
  };

  return (
    <>
      <button onClick={handleConfirm}>Confirm</button>
      {!myPlayer.isEvil && <button onClick={handleBack}>Back</button>}
    </>
  );
};

export default ConfirmButtons;
