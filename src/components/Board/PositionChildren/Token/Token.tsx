import React from 'react';
import { ReactComponent as SoundToken } from '../../../../assets/sound-token.svg';
import { ReactComponent as SightToken } from '../../../../assets/sight-token.svg';
import styles from './Token.module.scss';

const Token = ({ type }: { type: 'sight' | 'sound' }) => {
  return <div className={`${styles.token} ${styles[type]}`}>{type === 'sound' ? <SoundToken /> : <SightToken />}</div>;
};

export default Token;
