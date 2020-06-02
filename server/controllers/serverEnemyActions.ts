import { io } from '../../index';
import { updateBoard, startNextTurn, logProgress, logSound, isSeen } from './sharedFunctions';
import { ExtendedSocket, Position } from '../types';
import { Enemy } from '../modules/serverPlayer';

io.on('connection', (socket: ExtendedSocket) => {
    let currentEnemy: Enemy;

    socket.on('select enemy', ({ enemyID }: { enemyID: string }) => {
        currentEnemy = socket.game.enemies[enemyID];
    });

    socket.on('enemy selects pace', ({ pace }: { pace: string }) => {
        currentEnemy.pace = pace;
        currentEnemy.stepsLeft = pace === 'walk' ? 4 : 6;
        enemyStepOptions();

        logProgress(`${currentEnemy.id} is ${pace}ing`, { room: socket.game.id });
    });

    const enemyStepOptions = () => {
        let possibleSteps: Position[] = [];
        if (socket.game.seenSomeone(currentEnemy.id) || socket.game.heardSomeone(currentEnemy.id) || currentEnemy.playersVisible) {
            possibleSteps = socket.game.board.getReachable(currentEnemy.position, currentEnemy.stepsLeft, true);
        } else if (currentEnemy.isOnPath()) {
            possibleSteps = socket.game.board.getEnemyStandardReachable(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
        } else {
            possibleSteps = socket.game.board.getClosestWayToPath(currentEnemy.position, currentEnemy.path);
        }
        socket.emit('possible steps', { possibleSteps, stepsLeft: currentEnemy.stepsLeft });
    }

    socket.on('enemy takes step', ({ position }: { position: Position }) => {
        position = socket.game.getServerPosition(position.id);
        currentEnemy.move(position);
        socket.game.checkEnemyTarget(currentEnemy);

        for (let player of socket.game.players) {
            const seenBy = isSeen(player, socket.game);
            if (seenBy.length) {
                player.visible = true;
                player.updatePathVisibility(player.position, seenBy);

                logProgress(`${player.username} is seen by ${currentEnemy.id}`, { room: socket.game.id });
            }
        }
        if (currentEnemy.endOfPath()) {
            updateBoard(socket.game);
            chooseNewPath(currentEnemy.getNewPossiblePaths());
        } else {
            actOnEnemyStep();
        }
    });

    const actOnEnemyStep = () => {
        updateBoard(socket.game);
        enemyStepOptions();
    }

    const chooseNewPath = (paths: Position[][]) => {
        socket.emit('choose new path', ({ paths }));
    }

    socket.on('select path', ({ path }: { path: Position[] }) => {
        currentEnemy.path = path;
        logProgress(`${currentEnemy.id} has selected a new path`, { room: socket.game.id });

        actOnEnemyStep();
    });

    socket.on('enemy move completed', () => {
        socket.game.enemyMovesCompleted++;
        if (socket.game.enemyMovesCompleted === 2) {
            socket.game.enemyMovesCompleted = 0;
            enemyMoveComplete();
        } else {
            socket.emit('next enemy turn');
        }
    });

    const enemyMoveComplete = () => {
        socket.game.soundTokens = [];
        socket.game.sightTokens = [];
        socket.game.enemies.e1.playersVisible = false;
        socket.game.enemies.e2.playersVisible = false;

        enemyListen(socket.game.enemies.e1);
    }

    const enemyListen = (enemy: Enemy) => {
        if (enemy.pace === 'run') {
            waitForTokenPlacement(true);
            return;
        }

        const sound = socket.game.board.getRandomSound();
        for (let player of socket.game.players) {
            if (!socket.game.isCaught(player) || player.visible) {
                const playerSound = socket.game.board.getSoundReach(player.pace, sound);
                const heardTo = socket.game.board.isHeard(player.position, enemy.position, playerSound);
                if (heardTo) {
                    if (heardTo.length > 1) {
                        io.in(socket.game.id).emit('player select token', ({ heardTo, id: player.id, turn: 'enemy', enemyID: enemy.id }));
                    } else {
                        socket.game.addToken(heardTo[0].id, 'sound', enemy.id);
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

    socket.on('player placed token', ({ position, turn, enemyID }: { position: Position, turn: string, enemyID: string }) => {
        if (turn === 'enemy') {
            socket.game.addToken(position.id, 'sound', enemyID);
            waitForTokenPlacement();
        }
    });

    const waitForTokenPlacement = (run?: boolean) => {
        socket.game.placedSoundCounter++;
        if (socket.game.placedSoundCounter === socket.game.players.length || run) {
            socket.game.placedSoundCounter = 0;
            endEnemyTurn();
        }
    }

    const endEnemyTurn = () => {
        socket.game.enemyListened++;
        if (socket.game.enemyListened == 1) {
            enemyListen(socket.game.enemies.e2);
        } else if (socket.game.enemyListened == 2) {
            logSound(socket.game);

            socket.game.enemyListened = 0;
            updateBoard(socket.game);
            startNextTurn(socket.game);
        }
    }
});