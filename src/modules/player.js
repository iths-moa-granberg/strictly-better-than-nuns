class Player {
    constructor(id, home, key, goal, isEvil) {
        this.id = id;
        this.isEvil = isEvil;

        this.home = home;
        this.key = key;
        this.goal = goal;

        this.position = home;

        this.hasKey = false;
        this.hasGoal = false;
    }
}

class Enemy {
    constructor(id, position) {
        this.id = id;
        this.position = position;
        this.isEvil = true;
    }
}

export { Player, Enemy };
