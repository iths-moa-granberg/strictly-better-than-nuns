class EnemyModel {
    constructor() {
        this.path = enemyPaths[0]; //startvärde
        this.stepInPath = 0;
        this.x = this.path[this.stepInPath].x;
        this.y = this.path[this.stepInPath].y;

        this.winCounter = 0;
    }

    updateCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    moveStandardPath() {
        if (this.stepInPath != this.path.length -1) {
            this.stepInPath++;
            this.x = this.path[this.stepInPath].x;
            this.y = this.path[this.stepInPath].y;
        } else {
            this._chooseNewPath();
            this.updateCoordinates(this.path[this.stepInPath].x, this.path[this.stepInPath].y);
        }
    }

    _chooseNewPath() {
        let shuffledPaths = enemyPaths.concat().sort(function() { return .5 - Math.random() });
        for (let path of shuffledPaths) {                        
            if (path[0] === this.path[this.path.length -1] && path != this.path) {
                this.stepInPath = 1;
                return this.path = path;
            }
        }
    }

    getCurrentPath() {
        return this.path;
    }
}

class EnemyView {
    constructor() {
        this._enemyDiv = document.createElement('div');
        this._enemyDiv.className = 'enemy';
        document.querySelector('.board-wrapper').appendChild(this._enemyDiv);
    }

    updatePosition(x, y) {
        this._enemyDiv.style.top = `${y}px`;
        this._enemyDiv.style.left = `${x}px`;
    }
}

class EnemyController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.updatePosition(this.getX(), this.getY());
    }

    getX = () => {
        return this.model.x;
    }

    getY = () => {
        return this.model.y;
    }

    moveStandardPath = () => {
        this.model.moveStandardPath();
        this.view.updatePosition(this.getX(), this.getY());
    }

    getCurrentPath = () => {
        return this.model.getCurrentPath();
    }
}