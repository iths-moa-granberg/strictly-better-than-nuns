import React, { useState } from 'react';
import { socket } from '../../../../App';
import { Position, OnSelectPath } from '../../../../shared/sharedTypes';
import styles from '../Buttons.module.scss';

interface SelectPathButtonsProps {
  paths: Position[][];
  showNewPathHandler: Function;
  setActionState: Function;
}

const SelectPathButtons = ({ paths, showNewPathHandler, setActionState }: SelectPathButtonsProps) => {
  const [selectedPath, setSelectedPath] = useState<Position[]>();

  const handlerPathButton = (index: number) => {
    showNewPathHandler(paths[index]);
    setSelectedPath(paths[index]);
  };

  const handleSelect = () => {
    if (selectedPath) {
      const params: OnSelectPath = { path: selectedPath };
      socket.emit('select path', params);
      setActionState({ key: 'disabled enemy confirm' });
    }
  };

  return (
    <>
      <h1>Choose next path</h1>

      <div>
        {paths.map((path, index) => (
          <button
            key={index}
            onClick={() => handlerPathButton(index)}
            className={selectedPath === paths[index] ? `${styles.button} ${styles.active}` : `${styles.button}`}>
            {getLetter(index)}
          </button>
        ))}
      </div>

      {selectedPath && (
        <button className={`${styles.button} ${styles.confirm}`} onClick={handleSelect}>
          Confirm
        </button>
      )}
    </>
  );
};

const getLetter = (num: number) => {
  return String.fromCharCode(num + 65);
};

export default SelectPathButtons;
