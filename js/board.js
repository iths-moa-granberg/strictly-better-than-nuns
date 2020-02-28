class BoardModel {
    constructor() { }

    getAllReachable(startPosition, totalSteps) {
        let possiblePos = [startPosition];
        for (let steps = 0; steps < totalSteps; steps++) {
            for (let pos of possiblePos) {
                possiblePos = possiblePos.concat(this._getNeighbours(pos)
                    .filter(neighbour => !possiblePos.includes(neighbour)));
            }
        }
        return possiblePos;
    }

    _getNeighbours(position) {
        let neighbours = [];
        for (let neighbour of position.neighbours) {
            neighbours.push(positions[neighbour]);
        }
        return neighbours;
    }

    getPosition(x, y) {
        for (let position of Object.values(positions)) {
            if (position.x === x && position.y === y) {
                return position;
            }
        }
    }

    _getQueue(start, end) {
        let tested = [start];
        let queue = [[start]];

        for (let stepArr of queue) {
            let nextStep = [];
            for (let pos of stepArr) {
                let neighbours = this._getNeighbours(pos);
                neighbours = neighbours.filter(neighbour => !tested.includes(neighbour));
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

    getClosestPaths(start, end) {
        let queue = this._getQueue(start, end);
        let paths = [[end]];

        for (let path of paths) {
            for (let pos of path) {
                if (pos === path[path.length - 1]) {
                    let i = this._getPlaceInQueue(pos, queue) - 1;
                    let neighbours = this._getNeighbours(pos).filter(neighbour => queue[i].includes(neighbour));
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
            path = path.reverse();
        }
        return paths;
    }

    _getPlaceInQueue(position, queue) {
        let i = 0;
        for (let place of queue) {
            if (place.includes(position)) {
                return i;
            }
            i++;
        }
    }
}

class BoardView {
    constructor() {
        this._initRenderPositions();
        this.positionElements = document.querySelectorAll('.position');
    }

    _initRenderPositions() {
        for (let position of Object.values(positions)) {
            const positionElement = document.createElement('div');
            positionElement.className = 'position';
            positionElement.style.top = `${position.y}px`;
            positionElement.style.left = `${position.x}px`;
            positionElement.innerText = position.id;
            document.querySelector('.board-wrapper').appendChild(positionElement);
        }
    }

    bindSelectPosition(handler) {
        for (let position of Object.values(positions)) {
            this.positionElements[position.id - 1].addEventListener('click', e => {
                handler(position);
            });
        }
    }

    showReachablePositions(positionList) {
        this.resetPositions('reachable');
        for (let position of positionList) {
            this.positionElements[position.id - 1].classList.add('reachable');
        }
    }

    resetPositions(className) {
        for (let element of this.positionElements) {
            element.classList.remove(className);
        }
    }

    assignSpecialValue(position, className) {
        this.positionElements[position.id - 1].classList.add(className);
    }

    showEnemyCurrentPath(path) {
        this.resetPositions('enemy-path');
        for (let position of path) {
            this.positionElements[position.id - 1].classList.add('enemy-path');
        }
    }
}

class BoardController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindSelectPosition(this.handleSelectPosition);
    }

    handleSelectPosition = (position) => {
        game.positionSelected(position);
    }

    getPosition = (x, y) => {
        return this.model.getPosition(x, y);
    }

    showReachablePositions = (startPosition, steps) => {
        this.view.showReachablePositions(this.getAllReachables(startPosition, steps));
    }

    getAllReachables = (startPosition, steps) => {
        return this.model.getAllReachable(startPosition, steps);
    }

    resetPositions = (className) => {
        this.view.resetPositions(className);
    }

    assignSpecialValue = (position, className) => {
        this.view.assignSpecialValue(position, className);
    }

    showEnemyCurrentPath = (path) => {
        this.view.showEnemyCurrentPath(path);
    }

    getClosestPaths = (start, end) => {
        return this.model.getClosestPaths(start, end);
    }
}