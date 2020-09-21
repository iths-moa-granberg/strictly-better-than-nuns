import React from 'react';
import { socket } from '../../../../App';
import { OnSelectPath } from '../../../../shared/sharedTypes';
import styles from '../Buttons.module.scss';

interface SelectPathButtonsProps {
  pathNames: string[];
  setActionState: Function;
}

const SelectPathButtons = ({ pathNames, setActionState }: SelectPathButtonsProps) => {
  const handleSelect = (pathName: string) => {
    const params: OnSelectPath = { pathName };
    socket.emit('select path', params);
    setActionState({ key: 'disabled enemy confirm' });
  };

  return (
    <>
      <h1>Choose next path</h1>

      <div>
        {pathNames.map((name, index) => (
          <button key={name} onClick={() => handleSelect(name)} className={`${styles.button} ${styles[name]}`}>
            {getLetter(index)}
          </button>
        ))}
      </div>
    </>
  );
};

const getLetter = (num: number) => {
  return String.fromCharCode(num + 65);
};

export default SelectPathButtons;
