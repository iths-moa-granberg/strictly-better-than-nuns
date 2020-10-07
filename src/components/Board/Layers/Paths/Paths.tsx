import React from 'react';
import { ActionStateParams } from '../../../../clientTypes';
import paths from './paths-svg/pathIndex';
import styles from './Paths.module.scss';

interface PathsProps {
  actionState: { key: string; params?: ActionStateParams };
  possiblePaths: string[];
  viewAllPaths: boolean;
  e1Path: string;
  e2Path: string;
}

const Paths = ({ actionState, possiblePaths, viewAllPaths, e1Path, e2Path }: PathsProps) => {
  const Enemy1PathComp = paths[getPathComponentName(e1Path)];
  const Enemy2PathComp = paths[getPathComponentName(e2Path)];

  return (
    <article>
      {actionState.key === 'select new path' ? (
        possiblePaths.map((pathName) => {
          const Comp = paths[getPathComponentName(pathName)];
          return <Comp className={styles.path} key={pathName} />;
        })
      ) : viewAllPaths ? (
        <>
          {Object.values(paths).map((Path, index) => (
            <Path className={styles.path} key={index} />
          ))}
        </>
      ) : (
        <>
          <Enemy1PathComp className={styles.enemy1Path} />
          <Enemy2PathComp className={styles.enemy2Path} />
        </>
      )}
    </article>
  );
};

const getPathComponentName = (str: string) => {
  return `${str.charAt(0).toUpperCase() + str.slice(1)}`.substring(0, str.length - 1);
};

export default Paths;
