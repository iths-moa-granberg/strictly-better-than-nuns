class UserOptionsModel {
    constructor() { 
        this.steps;
    }

    updateSteps(steps) {
        this.steps = steps;
    }

    getSteps() {
        return this.steps;
    }
}

class UserOptionsView {
    constructor() {
        this.renderChooseSteps();
    }

    renderChooseSteps() {
        this.standBtn = this.createEl('button', '', 'Stand');
        this.sneakBtn = this.createEl('button', '', 'Sneak');
        this.walkBtn = this.createEl('button', '', 'Walk');
        this.runBtn = this.createEl('button', '', 'Run');

        const wrapper = document.querySelector('.user-options-wrapper');
        wrapper.appendChild(this.standBtn);
        wrapper.appendChild(this.sneakBtn);
        wrapper.appendChild(this.walkBtn);
        wrapper.appendChild(this.runBtn);
    }

    bindChooseStand(handler) {
        this.standBtn.addEventListener('click', e => { handler(0) });
    }

    bindChooseSneak(handler) {
        this.sneakBtn.addEventListener('click', e => { handler(1) });
    }

    bindChooseWalk(handler) {
        this.walkBtn.addEventListener('click', e => { handler(3) });
    }
    
    bindChooseRun(handler) {
        this.runBtn.addEventListener('click', e => { handler(5) });
    }

    createEl(tag, className, text) {
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

    choosenSteps = (steps) => {
        this.model.updateSteps(steps);
        game.stepsSelected(steps);
    }

    handleGetSteps = () => {
        return this.model.getSteps();
    }
}