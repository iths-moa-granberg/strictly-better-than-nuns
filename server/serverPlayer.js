class Player {
    constructor(id, home, key, goal, isEvil) {
        this.id = id;

        this.home = home;
        this.key = key;
        this.goal = goal;

        this.position = this.home;

        this.hasKey = false;
        this.hasGoal = false;

        this.isEvil = isEvil;
    }

    updatePosition(position) {
        this.position = position;
    }

    isOnTarget(target) {
        return target === this.position;
    }

    achiveKey() {
        this.hasKey = true;
    }

    achiveGoal() {
        this.hasGoal = true;
    }

    loseGoal() {
        this.hasGoal = false;
    }
}

module.exports = Player;