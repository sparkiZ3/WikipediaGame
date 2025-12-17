import { Player } from "./Player.js";

export class WikiGame {
    constructor(code) {
        this.codeGame = code;
        this.players = [];
        this.isStarted = false;
    }
    addPlayer(id, username) {
        const player = new Player(id,username);
        this.players.push(player);
    } 
    removePlayer(id) {
        this.players = this.players.filter(player => player.id !== id);
    }
    getPlayers() {
        return this.players;
    }
    startGame() {
        this.isStarted = true;
    }
}