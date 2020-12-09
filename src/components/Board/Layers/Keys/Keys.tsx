import React from 'react';

import keys from '../../../../shared/keys';

import { MyPlayer } from '../../../../clientTypes';
import ClientPlayer from '../../../../modules/clientPlayer';

interface KeysProps {
  readonly myPlayer: MyPlayer;
  readonly viewAll: boolean;
}

interface KeyProps {
  readonly x: number;
  readonly y: number;
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
      src={require('../../../../assets/key.svg')}
      alt="key"
      style={{ position: 'absolute', top: `${y * (856 / 900)}vh`, left: `${x * (856 / 900)}vh` }}
    />
  );
};

export default Keys;
