import React from 'react';
import styles from './Player.module.scss';

const Player = ({ playerId, direction }: { playerId: string; direction?: string }) => {
  if (isNaN(Number(playerId)) && direction) {
    return (
      <div className={styles.enemyPlayerWrapper}>
        <div className={`${styles.triangle} ${styles[direction]} ${styles[`${playerId.toString()}`]}`} />
        <div className={`${styles.player} ${styles[`${playerId.toString()}`]}`} />
      </div>
    );
  }
  return <div className={`${styles.player} ${styles[`${playerId.toString()}`]}`} />;
};

export default Player;