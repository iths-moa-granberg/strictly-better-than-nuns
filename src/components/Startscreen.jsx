import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import { Player, Enemy } from '../modules/player';
import { createUser } from './startscreenUtils';

const Startscreen = ({ setMyPlayer, myPlayer, setCurrentPlayer }) => {
  const [openGames, setOpenGames] = useState([]);
  const [enemyJoined, setEnemyJoined] = useState(false);
  const [joinedGame, setJoinedGame] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.on('start screen', ({ openGames }) => {
      setOpenGames(openGames);
    });

    socket.on('update open games', ({ openGames }) => {
      setOpenGames(openGames);
    });

    socket.on('disable join as evil', () => {
      setEnemyJoined(true);
    });

    socket.on('init', ({ enemyJoined }) => {
      setEnemyJoined(enemyJoined);
    });

    socket.on('set up player', ({ id, home, key, goal, isEvil }) => {
      const player = new Player(id, home, key, goal, isEvil);
      setMyPlayer(player);
      setCurrentPlayer(player);
    });

    socket.on('set up enemy', ({ startPositions }) => {
      const enemy = {
        e1: new Enemy('e1', startPositions[0]),
        e2: new Enemy('e2', startPositions[1]),
        isEvil: true,
      }
      setMyPlayer(enemy);
      setCurrentPlayer(enemy.e1);
    });

    socket.on('waiting for players', () => {
      setReady(false);
    });

    socket.on('players ready', () => {
      setReady(true);
    });
  });

  const join = good => {
    socket.emit('player joined', ({ good, user }));
  }

  const Game = ({ game }) => {
    return (
      <div>
        <h3>{game.name}</h3>
        <p>Joined players: {getUsernames(game.users)}</p>
        <button onClick={() => {
          setJoinedGame(true);
          socket.emit('join game', ({ gameID: game.id, user }))
        }}>Join</button>
      </div>
    );
  }

  const InputUsername = () => {
    const handleUsernameInput = e => {
      if (e.key === 'Enter') {
        setUser(createUser(e.target.value));
      }
    }

    return (
      <input type="text" placeholder="username"
        onKeyDown={e => handleUsernameInput(e)} />
    );
  }

  const StartButton = () => {
    return (
      <button onClick={() => socket.emit('start')}>Start</button>
    );
  }

  const GoodOrEvilButtons = () => {
    return (
      <div>
        <button disabled={enemyJoined} onClick={() => join(false)}>Evil</button>
        <button onClick={() => join(true)}>Good</button>
      </div>
    );
  }

  const GameList = () => {
    const handleNewGame = () => {
      setJoinedGame(true);
      socket.emit('init new game', { user });
    }

    return (
      <>
        {openGames.map(game => <Game key={game.id} game={game} />)}
        <button onClick={handleNewGame}>New game</button>
      </>
    );
  }

  const Content = () => {
    if (!user) return <InputUsername />
    if (ready) return <StartButton />
    if (myPlayer) return <p>wait for other players</p>
    if (joinedGame) return <GoodOrEvilButtons />
    return <GameList />
  }

  return (
    <div className="start-wrapper">
      <Content />
    </div>
  );
}

const getUsernames = users => {
  return Object.values(users).map(user => user.username).join(', ');
}

export default Startscreen;
