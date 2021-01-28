import React from 'react';
import styles from '../../../../scss/Buttons.module.scss';

interface SelectEnemyButtonsProps {
  readonly selectEnemyHandler: (enemyID: 'e1' | 'e2') => void;
}

const SelectEnemyButtons = ({ selectEnemyHandler }: SelectEnemyButtonsProps) => {
  return (
    <>
      <h1>Choose which enemy to start with</h1>

      <div>
        <button className={`${styles.button} ${styles.enemy1}`} onClick={() => selectEnemyHandler('e1')}>
          1
        </button>
        <button className={`${styles.button} ${styles.enemy2}`} onClick={() => selectEnemyHandler('e2')}>
          2
        </button>
      </div>
    </>
  );
};

export default SelectEnemyButtons;
