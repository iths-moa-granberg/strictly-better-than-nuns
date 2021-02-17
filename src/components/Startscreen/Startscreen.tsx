import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { socket } from '../../App';

import ClientPlayer from '../../modules/clientPlayer';
import ClientEnemy from '../../modules/clientEnemy';
import { createUser, getUsernames } from './startscreenUtils';

import LoadingScreen from '../LoadingScreen/LoadingScreen';

import { MyPlayer } from '../../clientTypes';
import {
  ClientUser,
  OnStartScreen,
  OnUpdateOpenGames,
  OnInit,
  OnSetUpPlayer,
  OnSetUpEnemy,
  OnJoinGame,
  OnPlayerJoined,
  OnInitNewGame,
  OpenGame,
} from '../../shared/sharedTypes';

import startscreenStyles from './Startscreen.module.scss';
import buttonStyles from '../../scss/Buttons.module.scss';
import inputUsernameStyles from './InputUsername.module.scss';
import gameListStyles from './GameList.module.scss';
import gameStyles from './Game.module.scss';
import playerListStyles from './PlayerList.module.scss';

interface StartscreenProps {
  readonly setMyPlayer: Dispatch<SetStateAction<MyPlayer | null>>;
  readonly myPlayer: MyPlayer | null;
  readonly setCurrentPlayerID: (id: 'e1' | 'e2' | null) => void;
}

const Startscreen = ({ setMyPlayer, myPlayer, setCurrentPlayerID }: StartscreenProps) => {
  const [openGames, setOpenGames] = useState<OpenGame[]>([]);
  const [enemyJoined, setEnemyJoined] = useState<boolean>(false);
  const [allGoodPlayersJoined, setAllGoodPlayersJoined] = useState<boolean>(false);
  const [joinedGame, setJoinedGame] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [user, setUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    const onStartScreen = ({ openGames }: OnStartScreen) => {
      setOpenGames(openGames);
    };

    const onUpdateOpenGames = ({ openGames }: OnUpdateOpenGames) => {
      setOpenGames(openGames);
    };

    const onDisableJoinAsEvil = () => {
      setEnemyJoined(true);
    };

    const onDisableJoinAsGood = () => {
      setAllGoodPlayersJoined(true);
    };

    const onInit = ({ enemyJoined, allGoodPlayersJoined }: OnInit) => {
      setEnemyJoined(enemyJoined);
      setAllGoodPlayersJoined(allGoodPlayersJoined);
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
    socket.on('disable join as good', onDisableJoinAsGood);
    socket.on('init', onInit);
    socket.on('waiting for players', onWaitingForPlayers);
    socket.on('players ready', onPlayersReady);

    return () => {
      socket.off('start screen', onStartScreen);
      socket.off('update open games', onUpdateOpenGames);
      socket.off('disable join as evil', onDisableJoinAsEvil);
      socket.off('disable join as good', onDisableJoinAsGood);
      socket.off('init', onInit);
      socket.off('waiting for players', onWaitingForPlayers);
      socket.off('players ready', onPlayersReady);
    };
  }, []);

  useEffect(() => {
    const onSetUpPlayer = ({ id, home, key, goal }: OnSetUpPlayer) => {
      const player = new ClientPlayer(id, home, key, goal);
      setMyPlayer(player);
    };

    const onSetUpEnemy = ({ startPositions }: OnSetUpEnemy) => {
      const enemy = {
        e1: new ClientEnemy('e1', startPositions[0]),
        e2: new ClientEnemy('e2', startPositions[1]),
        isEvil: true,
      };
      setMyPlayer(enemy);
      setCurrentPlayerID('e1');
    };

    socket.on('set up player', onSetUpPlayer);
    socket.on('set up enemy', onSetUpEnemy);

    return () => {
      socket.off('set up player', onSetUpPlayer);
      socket.off('set up enemy', onSetUpEnemy);
    };
  }, [setCurrentPlayerID, setMyPlayer]);

  const Game = ({ game }: { game: OpenGame }) => {
    return (
      <div className={gameStyles.gameWrapper}>
        <h3>{game.name}</h3>
        <p>Joined players: {getUsernames(game.users)}</p>
        <button
          className={buttonStyles.button}
          onClick={() => {
            setJoinedGame(true);
            if (user) {
              const params: OnJoinGame = { gameID: game.id, user };
              socket.emit('join game', params);
            }
          }}>
          Join
        </button>
      </div>
    );
  };

  const StartButton = () => {
    return (
      <button
        className={buttonStyles.button}
        onClick={() => {
          socket.emit('start');
        }}>
        Start
      </button>
    );
  };

  const GoodOrEvilButtons = () => {
    const join = (good: boolean) => {
      if (user) {
        const params: OnPlayerJoined = { good, user };
        socket.emit('player joined', params);
      }
    };

    return (
      <div>
        <button className={buttonStyles.button} disabled={enemyJoined} onClick={() => join(false)}>
          Evil
        </button>
        <button className={buttonStyles.button} disabled={allGoodPlayersJoined} onClick={() => join(true)}>
          Good
        </button>
      </div>
    );
  };

  const GameList = () => {
    const handleNewGame = () => {
      if (user) {
        setJoinedGame(true);
        const params: OnInitNewGame = { user };
        socket.emit('init new game', params);
      }
    };

    return (
      <div className={`${gameListStyles.gamesWrapper} ${openGames.length > 7 ? gameListStyles.start : ''}`}>
        <button className={`${buttonStyles.button} ${buttonStyles.big}`} onClick={handleNewGame}>
          New game
        </button>
        {openGames.map((game) => game.status === 'open' && <Game key={game.id} game={game} />)}
      </div>
    );
  };

  const PlayerList = () => {
    const myGame = openGames.find((game) => Object.keys(game.users).find((u) => u === (user as ClientUser).userID));

    if (myGame) {
      return (
        <div className={playerListStyles.playerListWrapper}>
          <h1>Players:</h1>
          <div className={playerListStyles.playersWrapper}>
            {Object.values(myGame.users).map((user, index) => (
              <p key={user.username + index} className={playerListStyles[`player-${user.playerID}`]}>
                {user.username} ({user.role ? user.role : '?'})
              </p>
            ))}
          </div>
        </div>
      );
    }

    return <LoadingScreen />;
  };

  const Content = () => {
    if (ready) return <StartButton />;
    if (myPlayer) return <p>Waiting for other players</p>;
    if (joinedGame) return <GoodOrEvilButtons />;
    return <GameList />;
  };

  const handleUsernameInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setUser(createUser((e.target as HTMLInputElement).value));
    }
  };

  return (
    <div className={startscreenStyles.startWrapper}>
      {joinedGame && <PlayerList />}
      {!user ? (
        <input
          className={inputUsernameStyles.input}
          type="text"
          placeholder="username"
          onKeyDown={(e) => handleUsernameInput(e)}
        />
      ) : (
        <Content />
      )}
    </div>
  );
};

export default Startscreen;
