import React, { useEffect, useState } from 'react';
import { socket } from '../../App';

import { OnSetEnemyWinGoal } from '../../shared/sharedTypes';

import styles from './ProgressBars.module.scss';

const ProgressBars = () => {
  const [roundCounter, setRoundCounter] = useState<number>(0);
  const [enemyWinCounter, setEnemyWinCounter] = useState<number>(0);
  const [enemyWinGoal, setEnemyWinGoal] = useState<number>(0);

  useEffect(() => {
    const onUpdateRoundCounter = () => setRoundCounter((c) => c + 1);
    const onUpdateEnemyWinCounter = () => setEnemyWinCounter((c) => c + 1);
    const onSetEnemyWinGoal = ({ num }: OnSetEnemyWinGoal) => setEnemyWinGoal(num);

    socket.on('update round counter', onUpdateRoundCounter);
    socket.on('update enemy win counter', onUpdateEnemyWinCounter);
    socket.on('set enemy win goal', onSetEnemyWinGoal);

    return () => {
      socket.off('update round counter', onUpdateRoundCounter);
      socket.off('update enemy win counter', onUpdateEnemyWinCounter);
      socket.off('set enemy win goal', onSetEnemyWinGoal);
    };
  }, [roundCounter, enemyWinCounter, enemyWinGoal]);

  return (
    <article className={styles.progressBarWrapper}>
      <div className={styles.barWrapper}>
        <div className={styles.textWrapper}>
          <p>Round counter</p>
          <p>{roundCounter}/15</p>
        </div>
        <div className={styles.bar}>
          <div
            className={`
          ${styles.progress}
          ${styles.roundCounter}
          ${styles[`step${roundCounter}`]}`}
          />
        </div>
      </div>

      <div className={styles.barWrapper}>
        <div className={styles.textWrapper}>
          <p>Enemy win counter</p>
          <p>{`${enemyWinCounter}/${enemyWinGoal}`}</p>
        </div>
        <div className={styles.bar}>
          <div
            className={`
          ${styles.progress}
          ${styles.enemyWinCounter}
          ${styles[`max${enemyWinGoal}`]}
          ${styles[`step${enemyWinCounter}`]}`}
          />
        </div>
      </div>
    </article>
  );
};

export default ProgressBars;
