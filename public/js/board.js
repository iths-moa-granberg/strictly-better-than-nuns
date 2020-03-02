class BoardView {
    constructor() {
        // this.positionElements = document.querySelectorAll('.position');
        // this.bindSelectPosition() //who to call??
    }

    renderBoard = (activePlayer, players, tokens, enemyPath, reachablePaths) => {
        for (let position of Object.values(positions)) {
            let className = ['position'];
            let child = '';
            
            for (let player of players) {
                if (player.positionId === position.id) {
                    child = this._renderPlayer(player.id);
                } 
            }
            if (tokens.find(tokenPos => tokenPos.id === position.id)) {
                className.push('token');
            }
            if (enemyPath.find(enemyPos => enemyPos.id === position.id)) {
                className.push('enemy-path');
            }
            if (reachablePaths.find(pos => pos.id === position.id)) {
                className.push('reachable');
            }
            if (activePlayer.key.id === position.id) {
                className.push('key');
            }
            if (activePlayer.goal.id === position.id) {
                className.push('goal');
            }
            if (activePlayer.home.id === position.id) {
                className.push('home');
            }
            document.querySelector('.board-wrapper').innerHTML += this._renderPosition(position, className.join(' '), child);
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
}