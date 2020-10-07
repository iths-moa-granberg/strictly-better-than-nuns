import React, { useEffect, useState } from 'react';
import { ActionStateParams, MyPlayer } from '../../../clientTypes';
import Paths from './Paths/Paths';
import Keys from './Keys/Keys';
import Goals from './Goals/Goals';
import styles from './Layers.module.scss';
import { ClientPlayer } from '../../../modules/player';

interface ToggleProps {
  myPlayer: MyPlayer;
  actionState: { key: string; params?: ActionStateParams };
  possiblePaths: string[];
  e1Path: string;
  e2Path: string;
}

const Toggle = ({ myPlayer, actionState, possiblePaths, e1Path, e2Path }: ToggleProps) => {
  const [viewAllKeys, setViewAllKeys] = useState<boolean>(myPlayer.isEvil);
  const [viewAllGoals, setViewAllGoals] = useState<boolean>(myPlayer.isEvil);
  const [viewAllPaths, setViewAllPaths] = useState<boolean>(false);

  const [viewLock, setViewLock] = useState<'locked' | 'unlocked'>(myPlayer.isEvil ? 'unlocked' : 'locked');

  useEffect(() => {
    if ((myPlayer as ClientPlayer).hasKey) {
      setViewLock('unlocked');
    }
  }, [myPlayer]);

  return (
    <>
      <Paths
        actionState={actionState}
        possiblePaths={possiblePaths}
        viewAllPaths={viewAllPaths}
        e1Path={e1Path}
        e2Path={e2Path}
      />

      <article className={`${styles.locks} ${styles[viewLock]}`} />

      <Keys myPlayer={myPlayer} viewAll={viewAllKeys} />

      <Goals myPlayer={myPlayer} viewAll={viewAllGoals} />

      <article className={styles.toggleWrapper}>
        <div className={styles.itemWrapper} onClick={() => setViewAllKeys(!viewAllKeys)}>
          <img src={require(`../../../assets/${viewAllKeys ? 'inactive-' : ''}key.svg`)} alt="key toggle" />
          <p>{viewAllKeys ? 'Hide all keys' : 'Show all keys'}</p>
        </div>
        <div className={styles.itemWrapper} onClick={() => setViewAllGoals(!viewAllGoals)}>
          <img src={require(`../../../assets/${viewAllGoals ? 'inactive-' : ''}goal.svg`)} alt="goal toggle" />
          <p>{viewAllGoals ? 'Hide all goals' : 'Show all goals'}</p>
        </div>
        <div className={styles.itemWrapper} onClick={() => setViewAllPaths(!viewAllPaths)}>
          <img src={require(`../../../assets/${viewAllPaths ? 'inactive-' : ''}path-toggle.svg`)} alt="path toggle" />
          <p>{viewAllPaths ? 'Hide all paths' : 'Show all paths'}</p>
        </div>
      </article>
    </>
  );
};

export default Toggle;
