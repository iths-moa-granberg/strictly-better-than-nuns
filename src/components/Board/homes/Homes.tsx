import React, { useEffect, useState } from 'react';
import { socket } from '../../../App';

import homes from './homeSvgs/homeIndex';

import { OnInitialPlayerIDs } from '../../../shared/sharedTypes';

import styles from './Homes.module.scss';

const Homes = () => {
  const [HomeList, setHomeList] = useState<React.FunctionComponent<React.SVGProps<SVGSVGElement>>[]>([]);

  useEffect(() => {
    const onSetInitialPlayerIDs = ({ playerIDs }: OnInitialPlayerIDs) => {
      setHomeList(playerIDs.map((id) => homes[`Home${id}`]));
    };

    socket.on('inital players id', onSetInitialPlayerIDs);

    return () => {
      socket.off('inital players id', onSetInitialPlayerIDs);
    };
  });

  return (
    <article className={styles.homesWrapper}>
      {HomeList.map((Home, index) => (
        <Home key={index} />
      ))}
    </article>
  );
};

export default Homes;
