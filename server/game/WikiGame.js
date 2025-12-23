import { Player } from "./Player.js";
import { Utils } from "../utils/Utils.js";

export class WikiGame {
    constructor(code) {
        this.codeGame = code;
        this.players = [];
        this.isStarted = false;
        this.initGame();
    }
    async initGame() {
        this.startGamePage = await Utils.getRandomWikipediaPage();
        this.endGamePage = await Utils.getRandomWikipediaPage();
        return this;
    }
    getGameInfo() {
        return {
            codeGame: this.codeGame,
            isStarted: this.isStarted,
            startGamePage: this.startGamePage,
            endGamePage : this.endGamePage
        };
    }
    addPlayer(id, username) {
        const player = new Player(id, username);
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