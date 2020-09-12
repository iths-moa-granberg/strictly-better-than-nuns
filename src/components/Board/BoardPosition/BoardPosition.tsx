import React from 'react';
import { Position } from '../../../shared/sharedTypes';
import styles from './BoardPosition.module.scss';

interface BoardPositionProps {
  position: Position;
  className: string[];
  children: JSX.Element[];
  clickHandler: Function;
}

const BoardPosition = ({ position, className, children, clickHandler }: BoardPositionProps) => {
  const newClassName = className.map((cN) => `${styles[cN]}`).join(' ');

  return (
    <div
      className={newClassName}
      style={{ top: `${position.y * (856 / 900)}vh`, left: `${position.x * (856 / 900)}vh` }}
      onClick={() => clickHandler(position)}>
      <p></p>
      {children}
    </div>
  );
};

export default BoardPosition;
