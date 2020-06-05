import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState('');
  const [openGames, setOpenGames] = useState([]);
  const [myPlayer, setMyPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    socket.on('start screen', ({ openGames }) => {
      setOpenGames(openGames);
      setGameState('startscreen');
    });
  });

  return (
    <div>
      {gameState === 'startscreen' &&
        <Startscreen
          openGames={openGames}
          setOpenGames={setOpenGames}
          myPlayer={myPlayer}
          setMyPlayer={setMyPlayer}
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
        />}
    </div>
  );
}

export { App, socket };
