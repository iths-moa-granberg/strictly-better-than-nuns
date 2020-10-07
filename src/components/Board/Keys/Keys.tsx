import React from 'react';
import { MyPlayer } from '../../../clientTypes';
import keys from '../../../shared/keys';
import { ClientPlayer } from '../../../modules/player';

interface KeysProps {
  myPlayer: MyPlayer;
  viewAll: boolean;
}

interface KeyProps {
  x: number;
  y: number;
}

const Keys = ({ myPlayer, viewAll }: KeysProps) => {
  if (viewAll) {
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

  if (myPlayer.isEvil || (myPlayer as ClientPlayer).hasKey) {
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
      src={require('../../../assets/key.svg')}
      alt="key"
      style={{ position: 'absolute', top: `${y * (856 / 900)}vh`, left: `${x * (856 / 900)}vh` }}
    />
  );
};

export default Keys;
