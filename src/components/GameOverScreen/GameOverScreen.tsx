import React from 'react';
import { ClientUser } from '../../shared/sharedTypes';
import styles from './GameOverScreen.module.scss';
import buttonStyles from '../../scss/Buttons.module.scss';

interface GameOverScreenProps {
  winner: ClientUser;
}

const GameOverScreen = ({ winner }: GameOverScreenProps) => {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <div className={styles.gameOverWrapper}>
      <h1 className={styles.gameOverHeading}>Game over!</h1>
      <h2 className={styles.gameOverWinner}>
        The winner is <span className={styles[`player-${winner.userID}`]}>{winner.username}!</span>
      </h2>
      <button className={`${buttonStyles.button} ${buttonStyles.big}`} onClick={handleClick}>
        New game
      </button>
    </div>
  );
};

export default GameOverScreen;
