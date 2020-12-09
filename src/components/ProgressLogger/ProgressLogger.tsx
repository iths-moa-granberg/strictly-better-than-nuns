import React, { useState, useEffect } from 'react';
import { socket } from '../../App';

import { OnProgress, OnSendMessage, ProgressLogObject } from '../../shared/sharedTypes';

import styles from './ProgressLogger.module.scss';

interface ProgressLoggerProps {
  readonly id: string;
}

const ProgressLogger = ({ id }: ProgressLoggerProps) => {
  const [messages, setMessages] = useState<ProgressLogObject[][]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const onProgress = ({ msg }: OnProgress) => {
      setMessages((m) => [msg, ...m]);
    };

    socket.on('progress', onProgress);

    return () => {
      socket.off('progress', onProgress);
    };
  }, [messages]);

  const handleChatInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      let msg = { text: inputValue, id };
      const params: OnSendMessage = { msg };
      socket.emit('send message', params);
      setInputValue('');
    }
  };

  return (
    <section className={styles.messageWrapper}>
      <article className={styles.progressLogWrapper}>
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
      </article>

      <article className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleChatInput(e)}
        />
      </article>
    </section>
  );
};

export default ProgressLogger;
