import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import { OnProgress, ProgressLogObject } from '../../shared/sharedTypes';
import styles from './ProgressLogger.module.scss';

const ProgressLogger = () => {
  const [messages, setMessages] = useState<ProgressLogObject[][]>([]);

  useEffect(() => {
    const onProgress = ({ msg }: OnProgress) => {
      setMessages((m) => [msg, ...m]);
    };

    socket.on('progress', onProgress);

    return () => {
      socket.off('progress', onProgress);
    };
  }, [messages]);

  return (
    <section className={styles.progressLogWrapper}>
      {messages.length > 0 &&
        messages.map((msg, index) => (
          <p key={index}>
            {msg.map((obj) => (
              <span className={obj.id ? styles[obj.id] : ''} key={obj.text}>
                {obj.text}
              </span>
            ))}
          </p>
        ))}
    </section>
  );
};

export default ProgressLogger;
