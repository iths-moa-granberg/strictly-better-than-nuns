import React from 'react';
import pathEndings from './path-endings/pathEndingsIndex';
import styles from './PathEndings.module.scss';

interface PathEndingsProps {
  readonly e1Path: string;
  readonly e2Path: string;
}

const PathEndings = ({ e1Path, e2Path }: PathEndingsProps) => {
  const getPathEnding = (path: string, enemyID: 'e1' | 'e2') => {
    const top = ['pinkA', 'purpleB', 'babyBlueB', 'peaB', 'darkGreenB'];
    const bottom = ['pinkB', 'blueA', 'greenA', 'redA', 'lightPurpleA', 'babyBlueA', 'yellowA', 'lightRedA'];
    const right = ['blueB', 'purpleA', 'greenB', 'mustardB', 'mossA'];
    const left = ['mustardA', 'bluePurpleA', 'darkGreenA', 'yellowB', 'lightRedB'];
    const middle = ['redB', 'lightPurpleB', 'peaA', 'mossB', 'bluePurpleB'];

    const pathEnding = top.includes(path)
      ? 'Top'
      : bottom.includes(path)
      ? 'Bottom'
      : right.includes(path)
      ? 'Right'
      : left.includes(path)
      ? 'Left'
      : middle.includes(path)
      ? 'Middle'
      : '';

    if (pathEnding === '') {
      console.log('Error: Path name does not match any path ending-group');
      return;
    }

    const Comp = pathEndings[pathEnding];
    return <Comp className={`${styles.pathEnding} ${styles[enemyID]}`} />;
  };

  return (
    <article className={styles.pathEndingWrapper}>
      {getPathEnding(e1Path, 'e1')}
      {getPathEnding(e2Path, 'e2')}
    </article>
  );
};

export default PathEndings;
