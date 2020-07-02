import React, { useState } from 'react';
import { socket } from '../../../../App';
import { Position } from '../../../../shared/sharedTypes';

interface SelectPathButtonsProps {
  paths: Position[];
  showNewPathHandler: Function;
}

const SelectPathButtons = ({ paths, showNewPathHandler }: SelectPathButtonsProps) => {
  const [selectedPath, setSelectedPath] = useState<Position>();

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
    socket.emit('select path', { path: selectedPath });
    return <></>;
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
