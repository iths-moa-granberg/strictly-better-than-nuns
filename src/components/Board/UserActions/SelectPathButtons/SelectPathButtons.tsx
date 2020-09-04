import React, { useState } from 'react';
import { socket } from '../../../../App';
import { Position, OnSelectPath } from '../../../../shared/sharedTypes';

interface SelectPathButtonsProps {
  paths: Position[][];
  showNewPathHandler: Function;
  setActionState: Function;
}

const SelectPathButtons = ({ paths, showNewPathHandler, setActionState }: SelectPathButtonsProps) => {
  const [selectedPath, setSelectedPath] = useState<Position[]>();

  const handlerPathButton = (text: string) => {
    const index = Number(
      text
        .split('')
        .filter((char) => char.match(/[0-9]/))
        .join('')
    );
    showNewPathHandler(paths[index]);
    setSelectedPath(paths[index]);
  };

  const handleSelect = () => {
    if (selectedPath) {
      const params: OnSelectPath = { path: selectedPath };
      socket.emit('select path', params);
      setActionState({ key: 'disabled enemy confirm' });
      return <></>;
    }
  };

  return (
    <>
      <p>Choose next path</p>
      {paths.map((path, index) => (
        <button
          key={index}
          onClick={(e) => handlerPathButton((e.target as HTMLElement).innerHTML)}
          className={!selectedPath || selectedPath === paths[index] ? '' : 'disabled'}>
          Path {index}
        </button>
      ))}
      {selectedPath && <button onClick={handleSelect}>Confirm</button>}
    </>
  );
};

export default SelectPathButtons;
