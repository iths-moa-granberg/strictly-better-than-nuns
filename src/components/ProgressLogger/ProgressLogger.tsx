import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import { OnProgress } from '../../shared/sharedTypes';

const ProgressLogger = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const onProgress = ({ msg }: OnProgress) => {
      if (messages[messages.length - 1] !== msg) {
        setMessages((m) => [...m, msg]);
      }
    };

    socket.on('progress', onProgress);

    return () => {
      socket.off('progress', onProgress);
    };
  }, [messages]);

  return (
    <section className="progress-log-wrapper">
      {messages.length > 0 && messages.map((msg, index) => <p key={index}>{msg}</p>)}
    </section>
  );
};

export default ProgressLogger;
