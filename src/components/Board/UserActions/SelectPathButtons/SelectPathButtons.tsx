import React, { useState } from 'react';
import { socket } from '../../../../App';

import { OnSetInitialPath, OnSelectPath } from '../../../../shared/sharedTypes';

import styles from './SelectPathButtons.module.scss';
import buttonStyles from '../../../../scss/Buttons.module.scss';

interface SelectPathButtonsProps {
  pathNames: string[];
  setActionState: Function;
  selectInitial?: boolean;
}

const SelectPathButtons = ({ pathNames, setActionState, selectInitial }: SelectPathButtonsProps) => {
  const [initialSelectCounter, setInitialSelectCounter] = useState<number>(0);

  const handleSelect = (pathName: string) => {
    if (selectInitial) {
      const params: OnSetInitialPath = { pathName };
      socket.emit('set initial path', params);
      setInitialSelectCounter(initialSelectCounter + 1);
    } else {
      const params: OnSelectPath = { pathName };
      socket.emit('select path', params);
      setActionState({ key: 'disabled enemy confirm' });
    }
  };

  return (
    <>
      {!selectInitial ? (
        <h1>Choose next path</h1>
      ) : initialSelectCounter === 0 ? (
        <h1>
          Choose path for <span className={styles.e1}>Enemy 1</span>
        </h1>
      ) : (
        <h1>
          Choose path for <span className={styles.e2}>Enemy 2</span>
        </h1>
      )}

      <div className={buttonStyles.buttonWrapper}>
        {pathNames.map((name, index) => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            className={`${buttonStyles.button} ${buttonStyles[getStyleName(name)]}`}>
            {getLetter(index)}
          </button>
        ))}
      </div>
    </>
  );
};

const getStyleName = (name: string) => {
  return name.substring(0, name.length - 1);
};

const getLetter = (num: number) => {
  return String.fromCharCode(num + 65);
};

export default SelectPathButtons;
