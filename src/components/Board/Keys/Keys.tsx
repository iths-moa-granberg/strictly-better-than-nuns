import React from 'react';
import { MyPlayer } from '../../../clientTypes';
import keys from '../../../shared/keys';
import { ClientPlayer } from '../../../modules/player';

interface KeysProps {
  myPlayer: MyPlayer;
}

interface KeyProps {
  x: number;
  y: number;
}

const Keys = ({ myPlayer }: KeysProps) => {
  if (myPlayer.isEvil) {
    return (
      <>
        <article className="keyWrapper">
          {keys.map((key) => (
            <Key x={key.x} y={key.y} key={key.id} />
          ))}
        </article>
      </>
    );
  }

  if ((myPlayer as ClientPlayer).hasKey) {
    return <></>;
  }

  const key = keys.find((k) => k.id === (myPlayer as ClientPlayer).key.id)!;
  return (
    <article className="keyWrapper">
      <Key x={key.x} y={key.y} />
    </article>
  );
};

const Key = ({ x, y }: KeyProps) => {
  return (
    <img
      src={require('../../../assets/key.png')}
      alt="key"
      style={{ position: 'absolute', top: `${y * (856 / 900)}vh`, left: `${x * (856 / 900)}vh` }}
    />
  );
};

export default Keys;
