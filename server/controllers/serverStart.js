import { io } from '../../index';
import Game from '../modules/serverGame';
import { Player } from '../modules/serverPlayer';
import { updateBoard, startNextTurn, logProgress } from './sharedFunctions';

let games = {};

const getOpenGames = () => {
    return Object.keys(games).map(id => {
        if (games[id].status === 'open') {
            return { id, name: games[id].name, users: games[id].users }
        }
    });
}

io.on('connection', socket => {

    socket.emit('start screen', { openGames: getOpenGames() });

    socket.on('init new game', ({ user }) => {
        socket.game = new Game();

        games[socket.game.id] = {
            game: socket.game,
            name: `${user.username}'s game`,
            status: 'open',
            users: { [user.userID]: { username: user.username, role: '' } },
        }
        io.emit('update open games', ({ openGames: getOpenGames() }));
        socket.join(socket.game.id);
        socket.emit('init', ({ enemyJoined: socket.game.enemyJoined }));

        logProgress(`${user.username} has joined`, { room: socket.game.id });
    });

    socket.on('join game', ({ gameID, user }) => {
        games[gameID].users[user.userID] = { username: user.username, role: '' };
        socket.game = games[gameID].game;

        io.emit('update open games', ({ openGames: getOpenGames() }));
        socket.join(socket.game.id);
        socket.emit('init', ({ enemyJoined: socket.game.enemyJoined }));
        io.in(socket.game.id).emit('waiting for players', ({ enemyJoined: socket.game.enemyJoined }));

        logProgress(`${user.username} has joined`, { room: socket.game.id });
    });

    socket.on('player joined', ({ good, user }) => {
        if (good) {
            games[socket.game.id].users[user.userID].role = 'good';
            socket.player = new Player(socket.game.generatePlayerInfo(user.username));

            socket.game.addPlayer(socket.player);
            socket.emit('set up player', {
                id: socket.player.id,
                home: socket.player.home,
                key: socket.player.key,
                goal: socket.player.goal,
                isEvil: socket.player.isEvil,
            });
        } else {
            games[socket.game.id].users[user.userID].role = 'evil';
            socket.player = socket.game.enemies;
            socket.game.enemyJoined = true;
            socket.emit('set up enemy', {
                startPositions: [socket.player.e1.position, socket.player.e2.position]
            });
            io.in(socket.game.id).emit('disable join as evil');
        }

        logProgress(`${user.username} is ${games[socket.game.id].users[user.userID].role}`, { room: socket.game.id });

        updateBoard(socket.game);
        if (playersReady()) {
            io.in(socket.game.id).emit('players ready');
        } else {
            io.in(socket.game.id).emit('waiting for players', ({ enemyJoined: socket.game.enemyJoined }));
        }
    });

    const playersReady = () => {
        let users = games[socket.game.id].users;
        if (Object.values(users).length < 2) {
            return false;
        }
        if (Object.values(users).find(user => user.role === '')) {
            return false;
        }
        return Object.values(users).filter(user => user.role === 'evil').length;
    }

    socket.on('start', () => {
        logProgress(`The game has started!`, { room: socket.game.id });

        socket.game.status = 'closed';
        io.emit('update open games', ({ openGames: getOpenGames() }));
        startNextTurn(socket.game);
        logProgress(`Players turn`, { room: socket.game.id });
    });
});