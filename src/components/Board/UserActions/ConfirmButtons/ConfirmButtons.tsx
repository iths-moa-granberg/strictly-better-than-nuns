import React, { useState } from 'react';
import { socket } from '../../../../App';
import { MyPlayer } from '../../../../clientTypes';

interface ConfirmButtonsProps {
  myPlayer: MyPlayer;
  setActionState: Function;
}

const ConfirmButtons = ({ myPlayer, setActionState }: ConfirmButtonsProps) => {
  const [disabled, setDisabled] = useState(false);

  const handleConfirm = () => {
    if (myPlayer.isEvil) {
      socket.emit('enemy move completed');
    } else {
      setDisabled(true);
      socket.emit('player move completed');
    }
  };

  const handleBack = () => {
    setActionState({ key: 'pace' });
    socket.emit('player reset move');
  };

  return (
    <>
      <button disabled={disabled} onClick={handleConfirm}>
        Confirm
      </button>
      {!myPlayer.isEvil && (
        <button disabled={disabled} onClick={handleBack}>
          Back
        </button>
      )}
    </>
  );
};

export default ConfirmButtons;
