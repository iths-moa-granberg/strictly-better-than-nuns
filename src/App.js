import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState('startscreen');
  const [myPlayer, setMyPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  return (
    <div>
      {gameState === 'startscreen' &&
        <Startscreen
          myPlayer={myPlayer}
          setMyPlayer={setMyPlayer}
          setCurrentPlayer={setCurrentPlayer}
        />}
    </div>
  );
}

export { App, socket };
