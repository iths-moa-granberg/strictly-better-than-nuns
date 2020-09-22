import React from 'react';
import { Position } from '../../../shared/sharedTypes';
import styles from './BoardPosition.module.scss';

interface BoardPositionProps {
  position: Position;
  className: string;
  children: JSX.Element[];
  clickHandler: Function;
}

const BoardPosition = ({ position, className, children, clickHandler }: BoardPositionProps) => {
  return (
    <div
      className={`${styles.position} ${styles[className]}`}
      style={{ top: `${position.y * (856 / 900)}vh`, left: `${position.x * (856 / 900)}vh` }}
      onClick={() => clickHandler(position)}>
      {children}
    </div>
  );
};

export default BoardPosition;
