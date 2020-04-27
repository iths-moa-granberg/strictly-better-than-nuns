// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


const Player = require('./server/serverPlayer');
const enemyPaths = require('./server/enemyPaths'); //behövs bara i serverPlayer?
const Game = require('./server/serverGame');
const Board = require('./server/serverBoard');

let games = {};

const getOpenGames = () => {
    return Object.keys(games).map(id => {        
        if (games[id].status === 'open') {
            return { id, name: games[id].name, users: games[id].users }
        }
    });
}

const generateGameID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}


io.on('connection', (socket) => {
    const enemy = { e1: new Player.Evil('e1', enemyPaths[0]), e2: new Player.Evil('e2', enemyPaths[2]) };
    let currentEnemy;
    let game;
    let board;
    let room;

    socket.emit('start screen', { openGames: getOpenGames() });

    socket.on('init new game', ({ username }) => {
        game = new Game();
        board = new Board();
        const id = generateGameID();

        games[id] = {
            game,
            board,
            name: `${username}'s game`,
            status: 'open',
            users: [username],
        }
        room = id;
        socket.join(room);
        socket.emit('init', ({ enemyJoined: game.enemyJoined }));
    });

    socket.on('join game', ({ gameID, username }) => {
        games[gameID].users.push(username);
        game = games[gameID].game;
        board = games[gameID].board;

        room = gameID;
        socket.join(room);
        socket.emit('init', ({ enemyJoined: game.enemyJoined }));
    });

    socket.on('player joined', ({ good }) => {
        if (good) {
            socket.player = new Player.Good(game.generatePlayerInfo());
            game.addPlayer(socket.player);
            socket.emit('set up player', {
                id: socket.player.id,
                home: socket.player.home,
                key: socket.player.key,
                goal: socket.player.goal,
                isEvil: socket.player.isEvil,
            });
        } else {
            socket.player = enemy;
            game.enemyJoined = true;
            socket.emit('set up enemy', {
                startPositions: [socket.player.e1.position, socket.player.e2.position]
            });
            io.in(room).emit('disable join as evil');
        }
        updateBoard();
    });

    socket.on('start', () => {
        startNextTurn();
    });

    const updateBoard = () => {
        io.in(room).emit('update board', {
            players: [enemy.e1, enemy.e2].concat(game.getVisiblePlayers()),
            soundTokens: game.soundTokens,
            sightTokens: game.sightTokens,
            enemyPaths: [enemy.e1.path, enemy.e2.path],
            reachablePositions: [],
        });
    }

    const startNextTurn = () => {
        game.startNextTurn();
        io.in(room).emit('players turn', { caughtPlayers: game.caughtPlayers });
    };

    const playerStepOptions = () => {
        let possibleSteps = [];
        if (game.isCaught(socket.player)) {
            possibleSteps = board.getClosestWayHome(socket.player.position, socket.player.home, socket.player.hasKey);
        } else {
            possibleSteps = board.getReachable(socket.player.position, socket.player.stepsLeft, socket.player.hasKey);
        }
        socket.emit('possible steps', {
            possibleSteps,
            visible: socket.player.visible,
        });
    }

    socket.on('player selects pace', ({ pace }) => {
        socket.player.pace = pace;
        socket.player.stepsLeft = pace === 'stand' ? 0
            : pace === 'sneak' ? 1
                : pace === 'walk' ? 3
                    : 5;
        playerStepOptions();
    });

    socket.on('select enemy', ({ enemyID }) => {
        currentEnemy = enemy[enemyID];
    });

    const enemyStepOptions = () => {
        let possibleSteps = [];
        if (game.seenSomeone(currentEnemy.id) || game.heardSomeone(currentEnemy.id) || currentEnemy.playersVisible) {
            possibleSteps = board.getReachable(currentEnemy.position, currentEnemy.stepsLeft, true);
        } else if (currentEnemy.isOnPath()) {
            possibleSteps = board.getEnemyStandardReachable(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
        } else {
            possibleSteps = board.getClosestWayToPath(currentEnemy.position, currentEnemy.path);
        }
        socket.emit('possible steps', { possibleSteps, stepsLeft: currentEnemy.stepsLeft });
    }

    socket.on('enemy selects pace', ({ pace }) => {
        currentEnemy.pace = pace;
        currentEnemy.stepsLeft = pace === 'walk' ? 4 : 6;
        enemyStepOptions();
    });

    socket.on('player takes step', ({ position }) => {
        position = game.getServerPosition(position.id)
        socket.player.position = position;
        socket.player.stepsLeft--;
        const seenBy = isSeen(socket.player);
        if (seenBy.length) {
            socket.player.visible = true;
        } else {
            socket.player.visible = false;
        }
        if (game.isCaught(socket.player) && !socket.player.visible) {
            game.removeCaughtPlayer(socket.player);
        }
        socket.player.path.push({ position, visible: socket.player.visible, enemyID: seenBy });

        playerStepOptions();
    });

    const chooseNewPath = (paths) => {
        socket.emit('choose new path', ({ paths }));
    }

    socket.on('select path', ({ path }) => {
        currentEnemy.path = path;
        actOnEnemyStep();
    });

    socket.on('enemy takes step', ({ position }) => {
        position = game.getServerPosition(position.id);
        currentEnemy.move(position);
        game.checkEnemyTarget(currentEnemy);

        for (let player of game.players) {
            const seenBy = isSeen(player);
            if (seenBy.length) {
                player.visible = true;
                player.updatePathVisibility(player.position, seenBy);
            }
        }
        if (currentEnemy.endOfPath()) {
            updateBoard();
            chooseNewPath(currentEnemy.getNewPossiblePaths());
        } else {
            actOnEnemyStep();
        }
    });

    const actOnEnemyStep = () => {
        updateBoard();
        enemyStepOptions();
    }

    socket.on('enemy move completed', () => {
        game.enemyMovesCompleted++;
        if (game.enemyMovesCompleted === 2) {
            game.enemyMovesCompleted = 0;
            enemyMoveComplete();
        } else {
            socket.emit('next enemy turn');
        }
    });

    const enemyMoveComplete = () => {
        game.soundTokens = [];
        game.sightTokens = [];
        enemy.e1.playersVisible = false;
        enemy.e2.playersVisible = false;

        enemyListen(enemy.e1);
    }

    const enemyListen = enemy => {
        if (enemy.pace === 'run') {
            waitForTokenPlacement(true);
            return;
        }

        const sound = board.getRandomSound();
        for (let player of game.players) {
            if (!game.isCaught(player) || player.visible) {
                const playerSound = board.getSoundReach(player.pace, sound);
                const heardTo = board.isHeard(player.position, enemy.position, playerSound);
                if (heardTo) {
                    if (heardTo.length > 1) {
                        io.in(room).emit('player select token', ({ heardTo, id: player.id, turn: 'enemy', enemyID: enemy.id }));
                    } else {
                        game.addToken(heardTo[0].id, 'sound', enemy.id);
                        waitForTokenPlacement();
                    }
                } else {
                    waitForTokenPlacement();
                }
            } else {
                waitForTokenPlacement();
            }
        }
    }

    const waitForTokenPlacement = (run) => {
        game.placedSoundCounter++;
        if (game.placedSoundCounter === game.players.length || run) {
            game.placedSoundCounter = 0;
            endEnemyTurn();
        }
    }

    const isSeen = (player) => {
        let seenBy = [];
        if (board.isSeen(player.position, enemy.e1.position, enemy.e1.lastPosition)) {
            seenBy.push('e1');
            enemy.e1.playersVisible = true;
        }
        if (board.isSeen(player.position, enemy.e2.position, enemy.e2.lastPosition)) {
            seenBy.push('e2');
            enemy.e2.playersVisible = true;
        }
        return seenBy;
    }

    socket.on('player move completed', () => {
        socket.player.checkTarget();

        if (socket.player.visible) {
            endPlayerTurn();
        } else {
            socket.player.caught = false;
            leaveSight(socket.player);

            const sound = board.getSoundReach(socket.player.pace, board.getRandomSound());
            playerMakeSound(socket.player, sound);
        }
    });

    const endPlayerTurn = () => {
        socket.player.resetPath(socket.player.path[0].enemyID);

        socket.emit('update player', {
            hasKey: socket.player.hasKey,
            hasGoal: socket.player.hasGoal,
            visible: socket.player.visible,
        });
        game.playerTurnCompleted++;
        if (game.playerTurnCompleted === game.players.length) {
            game.playerTurnCompleted = 0;
            startEnemyTurn();
        }
    }

    socket.on('player reset move', () => {
        socket.player.position = socket.player.path[0].position;
        socket.player.visible = socket.player.path[0].visible;
        socket.player.resetPath(socket.player.path[0].enemyID);
        if (socket.player.caught) {
            game.addCaughtPlayer(socket.player);
        }
        socket.emit('players turn', { resetPosition: socket.player.position, caughtPlayers: game.caughtPlayers });
    });

    const leaveSight = (player) => {
        let path = player.path.reverse();
        for (let obj of path) {
            if (obj.visible && obj != path[0]) {
                game.addToken(obj.position.id, 'sight', obj.enemyID);
                return
            }
        }
    }

    const playerMakeSound = (player, sound) => {
        if (game.enemyListened === 0) {
            game.enemyListened++;
            makeSound(player, sound, enemy.e1);
        } else if (game.enemyListened === 1) {
            game.enemyListened++;
            makeSound(player, sound, enemy.e2);
        } else {
            game.enemyListened = 0;
            endPlayerTurn();
        }
    }

    const makeSound = (player, sound, enemy) => {
        const heardTo = board.isHeard(player.position, enemy.position, sound);
        if (heardTo) {
            if (heardTo.length > 1) {
                socket.emit('player select token', { heardTo, id: player.id, turn: 'player', enemyID: enemy.id, sound });
                return
            } else {
                game.addToken(heardTo[0].id, 'sound', enemy.id);
            }
        }
        playerMakeSound(player, sound);
    }

    socket.on('player placed token', ({ position, turn, enemyID, sound }) => {
        game.addToken(position.id, 'sound', enemyID);
        if (turn === 'player') {
            playerMakeSound(socket.player, sound);
        } else if (turn === 'enemy') {
            waitForTokenPlacement();
        }
    });

    const endEnemyTurn = () => {
        game.enemyListened++;
        if (game.enemyListened == 1) {
            enemyListen(enemy.e2);
        } else if (game.enemyListened == 2) {
            game.enemyListened = 0;
            updateBoard();
            startNextTurn();
        }
    }

    const startEnemyTurn = () => {
        updateBoard();
        io.in(room).emit('enemy turn');
    }
});