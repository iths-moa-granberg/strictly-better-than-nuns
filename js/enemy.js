class EnemyModel {
    constructor() {
        this.x = 389;
        this.y = 96;

        this.winCounter = 0;
    }

    updateCoordinates(x, y) {
        this.x = x;
        this.y = y;
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
}