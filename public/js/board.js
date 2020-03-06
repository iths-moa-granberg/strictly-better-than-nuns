class BoardView {
    constructor() {
        this.activePlayer = {};
        this.players = [];
        this.soundTokens = [];
        this.sightTokens = [];
        this.enemyPath = [];
        this.reachablePositions = [];
    }

    renderBoard = () => {
        this._clearBoard();        
        for (let position of Object.values(positions)) {
            let className = ['position'];
            let child = '';

            if (position.id === this.activePlayer.position.id) {
                child += this._renderPlayer('1'); //obs fulhack
            }
            for (let player of this.players) {
                if (player.positionId === position.id) {
                    if (player.id === this.activePlayer.id) {
                        child += this._renderPlayer(player.id);
                    } else if (player.visible) {
                        child += this._renderPlayer(player.id);
                    }
                }
            }
            if (this.soundTokens.find(tokenPos => tokenPos.id === position.id)) {
                child += this._renderToken('sound');
            }
            if (this.sightTokens.find(tokenPos => tokenPos.id === position.id)) {
                child += this._renderToken('sight');
            }
            if (this.enemyPath.find(enemyPos => enemyPos.id === position.id)) {
                className.push('enemy-path');
            }
            if (this.reachablePositions.find(pos => pos.id === position.id)) {
                className.push('reachable');
            }
            if (this.activePlayer.key.id === position.id) {
                className.push('key');
            }
            if (this.activePlayer.goal.id === position.id) {
                className.push('goal');
            }
            if (this.activePlayer.home.id === position.id) {
                className.push('home');
            }
            document.querySelector('.board-wrapper').innerHTML += this._renderPosition(position, className.join(' '), child);
        }
    }

    addStepListener = (start, endups, handler) => {
        for (let position of Object.values(positions)) {
            if (start.neighbours.includes(position.id) && endups.find(pos => pos.id === position.id)) {
                const node = document.querySelectorAll('.position')[position.id - 1];
                node.addEventListener('click', e => handler(position));
            }
        }
    }

    _renderPosition = (position, className, child) => {
        return `
            <div class="${className}" style="top: ${position.y}px; left: ${position.x}px;">
                ${position.id}
                ${child}
            </div>
        `;
    }

    _renderPlayer = (playerId) => {
        return `
            <div class="player-${playerId.toString()}"></div>
        `;
    }

    _renderToken = (type) => {
        return `
            <div class="${type}-token"></div>
        `;
    }

    _clearBoard = () => {
        document.querySelector('.board-wrapper').innerHTML = '';
    }
}