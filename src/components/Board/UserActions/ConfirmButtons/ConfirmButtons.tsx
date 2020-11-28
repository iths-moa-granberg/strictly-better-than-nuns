import React from 'react';
import { socket } from '../../../../App';

import { MyPlayer } from '../../../../clientTypes';

import styles from '../../../../scss/Buttons.module.scss';

interface ConfirmButtonsProps {
  myPlayer: MyPlayer;
  setActionState: Function;
  disabled: boolean;
}

const ConfirmButtons = ({ myPlayer, setActionState, disabled }: ConfirmButtonsProps) => {
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
      {disabled ? <h1>Take step</h1> : <h1>Confirm or take step</h1>}

      <div>
        <button className={`${styles.button} ${styles.confirm}`} disabled={disabled} onClick={handleConfirm}>
          Confirm
        </button>
        {!myPlayer.isEvil && (
          <button className={`${styles.button} ${styles.back}`} disabled={disabled} onClick={handleBack}>
            Back
          </button>
        )}
      </div>

      {!myPlayer.isEvil && <p>Confirm destination or click back and re-do your turn</p>}

      {disabled ? (
        <p>Click on position next to your player to take a step</p>
      ) : (
        <>
          <p>Confirm destination or click on a position next to your player to take a step</p>
        </>
      )}
    </>
  );
};

export default ConfirmButtons;
