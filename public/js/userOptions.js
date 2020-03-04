class UserOptions {
    constructor() {
        this.wrapper = document.querySelector('.user-options-wrapper');
    }

    renderPaceBtns = (handler, selected, className) => {
        this.wrapper.innerHTML = '';
        const types = ['Stand', 'Sneak', 'Walk', 'Run'];
        for (let type of types) {
            if (selected && type.toLowerCase() != selected) {
                this.wrapper.innerHTML += this._renderBtn(type, className);
            } else {
                this.wrapper.innerHTML += this._renderBtn(type, '');
            }
        }
        this._addListeners(handler);
    }

    _renderBtn = (type, className) => {
        return `
        <button class="${type.toLowerCase()} ${className}">${type}</button>
        `;
    }

    _addListeners = (handler) => {
        const btns = this.wrapper.querySelectorAll('button');
        for (let btn of btns) {
            btn.addEventListener('click', e => handler(btn.innerText.toLowerCase()));
        }
    }

    disableBtns = () => {
        const btns = this.wrapper.querySelectorAll('button');
        btns.forEach(btn => btn.disabled = true);
    }

    renderConfirmDestinationBtn = (handler) => {
        this.wrapper.innerHTML = this._renderBtn('Confirm');
        // this.wrapper.innerHTML += this._renderBtn('Back');
        this._addListeners(handler);
    }
}