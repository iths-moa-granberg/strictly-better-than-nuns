import React from 'react';

import { ReactComponent as SoundToken } from '../../../../assets/sound-token.svg';
import { ReactComponent as SightToken } from '../../../../assets/sight-token.svg';

import styles from './Token.module.scss';

interface TokenProps {
  readonly type: 'sight' | 'sound';
  readonly clickable?: boolean;
}

const Token = ({ type, clickable }: TokenProps) => {
  return (
    <div className={`${styles.token} ${styles[type]} ${styles[clickable ? 'clickable' : '']}`}>
      {type === 'sound' ? <SoundToken /> : <SightToken />}
    </div>
  );
};

export default Token;
