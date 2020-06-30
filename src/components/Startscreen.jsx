import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import { Player, Enemy } from '../modules/player';
import { createUser, getUsernames } from './startscreenUtils';

const Startscreen = ({ setMyPlayer, myPlayer, setCurrentPlayerId }) => {
  const [openGames, setOpenGames] = useState([]);
  const [enemyJoined, setEnemyJoined] = useState(false);
  const [joinedGame, setJoinedGame] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onStartScreen = ({ openGames }) => {
      setOpenGames(openGames);
    };

    const onUpdateOpenGames = ({ openGames }) => {
      setOpenGames(openGames);
    };

    const onDisableJoinAsEvil = () => {
      setEnemyJoined(true);
    };

    const onInit = ({ enemyJoined }) => {
      setEnemyJoined(enemyJoined);
    };

    const onWaitingForPlayers = () => {
      setReady(false);
    };

    const onPlayersReady = () => {
      setReady(true);
    };

    socket.on('start screen', onStartScreen);
    socket.on('update open games', onUpdateOpenGames);
    socket.on('disable join as evil', onDisableJoinAsEvil);
    socket.on('init', onInit);
    socket.on('waiting for players', onWaitingForPlayers);
    socket.on('players ready', onPlayersReady);

    return () => {
      socket.off('start screen', onStartScreen);
      socket.off('update open games', onUpdateOpenGames);
      socket.off('disable join as evil', onDisableJoinAsEvil);
      socket.off('init', onInit);
      socket.off('waiting for players', onWaitingForPlayers);
      socket.off('players ready', onPlayersReady);
    };
  }, []);

  useEffect(() => {
    const onSetUpPlayer = ({ id, home, key, goal, isEvil }) => {
      const player = new Player(id, home, key, goal, isEvil);
      setMyPlayer(player);
    };

    const onSetUpEnemy = ({ startPositions }) => {
      const enemy = {
        e1: new Enemy('e1', startPositions[0]),
        e2: new Enemy('e2', startPositions[1]),
        isEvil: true,
      };
      setMyPlayer(enemy);
      setCurrentPlayerId('e1');
    };

    socket.on('set up player', onSetUpPlayer);
    socket.on('set up enemy', onSetUpEnemy);

    return () => {
      socket.off('set up player', onSetUpPlayer);
      socket.off('set up enemy', onSetUpEnemy);
    };
  }, [setCurrentPlayerId, setMyPlayer]);

  const Game = ({ game }) => {
    return (
      <div>
        <h3>{game.name}</h3>
        <p>Joined players: {getUsernames(game.users)}</p>
        <button
          onClick={() => {
            setJoinedGame(true);
            socket.emit('join game', { gameID: game.id, user });
          }}>
          Join
        </button>
      </div>
    );
  };

  const InputUsername = () => {
    const handleUsernameInput = (e) => {
      if (e.key === 'Enter') {
        setUser(createUser(e.target.value));
      }
    };

    return <input type="text" placeholder="username" onKeyDown={(e) => handleUsernameInput(e)} />;
  };

  const StartButton = () => {
    return (
      <button
        onClick={() => {
          socket.emit('start');
        }}>
        Start
      </button>
    );
  };

  const GoodOrEvilButtons = () => {
    const join = (good) => {
      socket.emit('player joined', { good, user });
    };

    return (
      <div>
        <button disabled={enemyJoined} onClick={() => join(false)}>
          Evil
        </button>
        <button onClick={() => join(true)}>Good</button>
      </div>
    );
  };

  const GameList = () => {
    const handleNewGame = () => {
      setJoinedGame(true);
      socket.emit('init new game', { user });
    };

    return (
      <>
        {openGames.map((game) => (
          <Game key={game.id} game={game} />
        ))}
        <button onClick={handleNewGame}>New game</button>
      </>
    );
  };

  const Content = () => {
    if (!user) return <InputUsername />;
    if (ready) return <StartButton />;
    if (myPlayer) return <p>wait for other players</p>;
    if (joinedGame) return <GoodOrEvilButtons />;
    return <GameList />;
  };

  return (
    <div className="start-wrapper">
      <Content />
    </div>
  );
};

export default Startscreen;
