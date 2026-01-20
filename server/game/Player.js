export class Player {
    constructor(id,username, isOwner=false) {
        this.id = id;
        this.username = username;
        this.clicks = 0;
        this.history = [];
        this.isOwner = isOwner;
    }
    getPlayerInfo() {
        return {
            id: this.id,
            username: this.username,
            clicks: this.clicks,
            history: this.history,
            isOwner: this.isOwner
        };
    }
}