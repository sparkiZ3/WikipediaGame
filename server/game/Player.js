export class Player {
    constructor(id,username) {
        this.id = id;
        this.username = username;
        this.clicks = 0;
        this.history = [];
    }
    getPlayerInfo() {
        return {
            id: this.id,
            username: this.username,
            clicks: this.clicks,
            history: this.history
        };
    }
}