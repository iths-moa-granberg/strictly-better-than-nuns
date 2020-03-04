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
}