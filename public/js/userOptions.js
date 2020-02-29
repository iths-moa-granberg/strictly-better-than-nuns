class UserOptionsModel {
    constructor() { 
        this.steps;
    }

    updateSteps(steps) {
        this.steps = steps;
    }
}

class UserOptionsView {
    constructor() {
        this._renderChooseSteps();
    }

    _renderChooseSteps() {
        this.standBtn = this._createEl('button', '', 'Stand');
        this.sneakBtn = this._createEl('button', '', 'Sneak');
        this.walkBtn = this._createEl('button', '', 'Walk');
        this.runBtn = this._createEl('button', '', 'Run');

        const wrapper = document.querySelector('.user-options-wrapper');
        wrapper.appendChild(this.standBtn);
        wrapper.appendChild(this.sneakBtn);
        wrapper.appendChild(this.walkBtn);
        wrapper.appendChild(this.runBtn);
    }

    bindChooseStand(handler) {
        this.standBtn.addEventListener('click', e => { handler(0, 'stand') });
    }

    bindChooseSneak(handler) {
        this.sneakBtn.addEventListener('click', e => { handler(1, 'sneak') }); //1-2
    }

    bindChooseWalk(handler) {
        this.walkBtn.addEventListener('click', e => { handler(3, 'walk') }); //3-4
    }
    
    bindChooseRun(handler) {
        this.runBtn.addEventListener('click', e => { handler(5, 'run') }); //1-5
    }

    _createEl(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.classlist.add(className);
        }
        if (text) {
            element.innerText = text;
        }
        return element;
    }
}

class UserOptionsController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindChooseStand(this.choosenSteps);
        this.view.bindChooseSneak(this.choosenSteps);
        this.view.bindChooseWalk(this.choosenSteps);
        this.view.bindChooseRun(this.choosenSteps);
    }

    choosenSteps = (steps, pace) => {
        this.model.updateSteps(steps);
        game.stepsSelected(steps, pace);
    }

    getSteps = () => {
        return this.model.steps;
    }
}