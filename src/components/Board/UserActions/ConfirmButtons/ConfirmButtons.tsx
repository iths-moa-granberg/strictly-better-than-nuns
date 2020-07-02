import React from 'react';
import { socket } from '../../../../App';
import { MyPlayer } from '../../../../clientTypes';

interface ConfirmButtonsProps {
  myPlayer: MyPlayer;
  setActionState: Function;
}

const ConfirmButtons = ({ myPlayer, setActionState }: ConfirmButtonsProps) => {
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
