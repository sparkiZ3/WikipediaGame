export class Player {
    constructor(id,username) {
        this.id = id;
        this.username = username;
    }
    getPlayerInfo() {
        return {
            id: this.id,
            username: this.username
        };
    }
}