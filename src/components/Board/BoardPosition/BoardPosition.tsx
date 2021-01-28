import React from 'react';
import { Position } from '../../../shared/sharedTypes';
import styles from './BoardPosition.module.scss';

interface BoardPositionProps {
  readonly position: Position;
  readonly className: {
    reachable: string;
    clickable: string;
  };
  readonly children: JSX.Element[];
  readonly clickHandler: (position: Position) => void;
}

const BoardPosition = ({ position, className, children, clickHandler }: BoardPositionProps) => {
  const multipleChildren = children.length > 1 ? 'multipleChildren' : '';

  return (
    <div
      className={`
        ${styles.position} 
        ${styles[className.reachable]} 
        ${styles[className.clickable]} 
        ${styles[multipleChildren]}
      `}
      style={{ top: `${position.y * (856 / 900)}vh`, left: `${position.x * (856 / 900)}vh` }}
      onClick={() => clickHandler(position)}>
      {children}
    </div>
  );
};

export default BoardPosition;
