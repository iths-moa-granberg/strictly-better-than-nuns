import React from 'react';

import { ClientUser } from '../../shared/sharedTypes';

import styles from './GameOverScreen.module.scss';
import buttonStyles from '../../scss/Buttons.module.scss';

interface GameOverScreenProps {
  readonly winners: ClientUser[];
}

const formatWinners = (winners: ClientUser[]) => {
  const nameHtml = [];

  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];

    if (i >= 1) {
      if (i === winners.length - 1) {
        nameHtml.push(' and ');
      } else {
        nameHtml.push(', ');
      }
    }

    nameHtml.push(
      <span key={winner.userID} className={styles[`player-${winner.userID}`]}>
        {winner.username}
      </span>
    );
  }

  return nameHtml;
};

const GameOverScreen = ({ winners }: GameOverScreenProps) => {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <div className={styles.gameOverWrapper}>
      <h1 className={styles.gameOverHeading}>Game over!</h1>
      <h2 className={styles.gameOverWinner}>
        The {winners.length === 1 ? 'winner is' : 'winners are'} {formatWinners(winners)}!
      </h2>
      <button className={`${buttonStyles.button} ${buttonStyles.big}`} onClick={handleClick}>
        New game
      </button>
    </div>
  );
};

export default GameOverScreen;
