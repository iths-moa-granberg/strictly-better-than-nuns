class Player {
    constructor(id, home, key, goal) {
        this.id = id;

        this.home = home;
        this.key = key;
        this.goal = goal;

        this.position = this.home;

        this.hasKey = false;
        this.hasGoal = false;
    }

    updatePosition(position) {
        this.position = position;
    }

    achieveKey() {
        this.hasKey = true;
    }

    achieveGoal() {
        this.hasGoal = true;
    }

    loseGoal() {
        this.hasGoal = false;
    }
}