class Board {
    constructor(positions) {
        this.positions = positions;
    }

    getReachable = (startPosition, totalSteps, hasKey) => { //jämför id
        let possiblePos = [startPosition];
        for (let steps = 0; steps < totalSteps; steps++) {
            for (let pos of possiblePos) {
                possiblePos = possiblePos.concat(this._getNeighbours(pos)
                    .filter(neighbour => !possiblePos.includes(neighbour)));
                if (!hasKey) {
                    possiblePos = possiblePos.filter(pos => !pos.requireKey);
                }
            }
        }
        return possiblePos;
    }

    _getNeighbours = (position) => {
        let neighbours = [];
        for (let neighbour of position.neighbours) {
            neighbours.push(this.positions[neighbour]);
        }
        return neighbours;
    }

    getClosestPaths = (start, end, hasKey) => {
        let queue = this._getQueue(start, end);
        let paths = [[end]];

        for (let path of paths) {
            for (let pos of path) {
                if (pos === path[path.length - 1]) {
                    let i = this._getPlaceInQueue(pos, queue) - 1;
                    let neighbours = this._getNeighbours(pos).filter(neighbour => queue[i].includes(neighbour));
                    if (!hasKey) {
                        neighbours = neighbours.filter(pos => !pos.requireKey);
                    }
                    if (neighbours.length === 1) {
                        path.push(neighbours[0]);
                    } else if (neighbours.length === 2) {
                        let newPath = path.slice();
                        newPath.push(neighbours[0]);
                        paths.push(newPath);
                        path.push(neighbours[1]);
                    } else if (neighbours.length > 2) {
                        console.log('error: fanns fler än två möjliga håll att gå från en position');
                    }
                    if (path.includes(start)) {
                        break
                    }
                }
            }
        }
        paths.forEach(path => path.push(start));
        return paths;
    }

    _getQueue = (start, end) => {
        let tested = [start];
        let queue = [[start]];

        for (let stepArr of queue) {
            let nextStep = [];
            for (let pos of stepArr) {
                let neighbours = this._getNeighbours(pos);
                neighbours = neighbours.filter(neighbour => !tested.find(pos => neighbour.id === pos.id));
                tested = tested.concat(neighbours);
                nextStep = nextStep.concat(neighbours);
            }
            queue.push(nextStep);
            if (nextStep.includes(end)) {
                break
            }
        }
        return queue;
    }

    _getPlaceInQueue = (position, queue) => {
        let i = 0;
        for (let place of queue) {
            if (place.includes(position)) {
                return i;
            }
            i++;
        }
    }

    isHeard = (playerPos, enemyPos, pace) => {
        const sound = this._getRandomSoundReach(pace);
        console.log('sound: ', sound);
        const reaches = this.getReachable(playerPos, sound, true);

        if (reaches.find(pos => pos.id === enemyPos.id)) {
            const soundPaths = this.getClosestPaths(playerPos, enemyPos, true);

            let tokenPositions = [];
            for (let path of soundPaths) {
                tokenPositions.push(path[1]);
            }
            return tokenPositions;
        } else {
            return;
        }
    }

    _getRandomSoundReach = (pace) => {
        let sound = Math.floor(Math.random() * 6) + 1;
        return pace === 'stand' ? sound - 3
            : pace === 'sneak' ? sound - 2
                : pace === 'walk' ? sound - 1
                    : sound;
    }

    isSeen = (position, enemyPos, enemyLastPos) => {
        if (enemyPos.x === enemyLastPos.x) {
            if (enemyPos.y < enemyLastPos.y) {
                return enemyPos.inSight.includes(position.id) && position.y <= enemyPos.y;
            } else {
                return enemyPos.inSight.includes(position.id) && position.y >= enemyPos.y;
            }
        } else if (enemyPos.y === enemyLastPos.y) {
            if (enemyPos.x < enemyLastPos.x) {
                return enemyPos.inSight.includes(position.id) && position.x <= enemyPos.x;
            } else {
                return enemyPos.inSight.includes(position.id) && position.x >= enemyPos.x;
            }
        }
    }
}

module.exports = Board;