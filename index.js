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
const game = new Game();
const Board = require('./server/serverBoard');
const board = new Board();

const enemy = { e1: new Player.Evil('enemy1', enemyPaths[0]), e2: new Player.Evil('enemy2', enemyPaths[2]) };
let currentEnemy;

io.on('connection', (socket) => {
    socket.emit('init', { enemyJoined: game.enemyJoined });

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
            io.sockets.emit('disable join as evil');
        }
        updateBoard();
    });

    socket.on('start', () => {
        startNextTurn();
    });

    const updateBoard = () => {
        io.sockets.emit('update board', {
            players: [enemy.e1, enemy.e2].concat(game.getVisiblePlayers()),
            soundTokens: game.soundTokens,
            sightTokens: game.sightTokens,
            enemyPaths: [enemy.e1.path, enemy.e2.path],
            reachablePositions: [],
        });
    }

    const startNextTurn = () => {
        game.startNextTurn();
        io.sockets.emit('players turn', { caughtPlayers: game.caughtPlayers });
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
        if (game.soundTokens.length || game.sightTokens.length || game.playersIsVisible()) {
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
        socket.player.visible = isSeen(socket.player);
        if (game.isCaught(socket.player) && !socket.player.visible) {
            game.removeCaughtPlayer(socket.player);
        }
        socket.player.path.push({ position, visible: socket.player.visible });

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
            if (isSeen(player)) {
                player.visible = true;
                player.updatePathVisibility(player.position);
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

        if (currentEnemy.pace === 'run') {
            endEnemyTurn();
            return;
        }
        //TODO: make work without running
        const sound = board.getRandomSound();
        for (let player of game.players) {
            if (!game.isCaught(player) || player.visible) {
                const playerSound = board.getSoundReach(player.pace, sound);
                const heardTo = board.isHeard(player.position, enemy.position, playerSound);
                if (heardTo) {
                    if (heardTo.length > 1) {
                        io.sockets.emit('player select token', ({ heardTo, id: player.id, turn: 'enemy' }));
                    } else {
                        game.addToken(heardTo[0], 'sound');
                        endEnemyTurn();
                    }
                } else {
                    endEnemyTurn();
                }
            } else {
                endEnemyTurn();
            }
        }
    }

    const isSeen = (player) => {
        return board.isSeen(player.position, enemy.e1.position, enemy.e1.lastPosition); //TODO: check both enemies, if true link to enemy
    }

    socket.on('player move completed', () => {
        socket.player.checkTarget();

        if (!socket.player.visible) {
            socket.player.caught = false;
            leaveSight(socket.player);

            const sound = board.getSoundReach(socket.player.pace, board.getRandomSound());
            if (makeSound(socket.player, sound)) {
                return
            }
        }
        endPlayerTurn();
    });

    const endPlayerTurn = () => {
        socket.player.resetPath();

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
        socket.player.resetPath();
        if (socket.player.caught) {
            game.addCaughtPlayer(socket.player);
        }
        socket.emit('players turn', { resetPosition: socket.player.position, caughtPlayers: game.caughtPlayers });
    });

    const leaveSight = (player) => {
        let path = player.path.reverse();
        for (let obj of path) {
            if (obj.visible && obj != path[0]) {
                game.addToken(obj.position, 'sight');
                return
            }
        }
    }

    const makeSound = (player, sound) => {
        const heardTo = board.isHeard(player.position, enemy.e1.position, sound); //TODO: check both enemies, link sound to enemy
        if (heardTo) {
            if (heardTo.length > 1) {
                socket.emit('player select token', { heardTo, id: player.id, turn: 'player' });
                return true;
            } else {
                game.addToken(heardTo[0], 'sound');
            }
        }
        return false;
    }

    socket.on('player placed token', ({ position, turn }) => {
        game.addToken(position, 'sound');
        if (turn === 'player') {
            endPlayerTurn();
        } else if (turn === 'enemy') {
            endEnemyTurn();
        }
    });

    const endEnemyTurn = () => {
        game.placedSoundCounter++;
        if (game.placedSoundCounter === game.players.length || enemy.pace === 'run') {
            game.placedSoundCounter = 0;
            updateBoard();
            startNextTurn();
        }
    }

    const startEnemyTurn = () => {
        updateBoard();
        io.sockets.emit('enemy turn');
    }
});