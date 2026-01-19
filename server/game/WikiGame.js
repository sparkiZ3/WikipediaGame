import { Player } from "./Player.js";
import { Utils } from "../utils/Utils.js";

export class WikiGame {
    constructor(code) {
        this.codeGame = code;
        this.players = {};
        this.isStarted = false;
        this.initGame();
    }
    async initGame() {
        this.startGamePage = await Utils.getRandomWikipediaPage();
        //this.endGamePage = await Utils.getRandomWikipediaPage();
        this.endGamePage = {
            "title":"Pornographie",
            "url":"https://fr.wikipedia.org/wiki/Pornographie"
        };
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
    linkClicked(username, url){
        function formatLink(url){
            const splitURL = url.split("/");
            const pageName = splitURL[splitURL.length - 1];
            pageName.replace("_", " ");
            return {
                title: decodeURIComponent(pageName),
                url: url
            }
        }
        const player = this.players[username];
        if (player){
            player.clicks +=1;
            player.history.push(formatLink(url));
        }
        console.log(player.getPlayerInfo());
    }
    async setNewObjective(){
        const objective = await Utils.getRandomWikipediaPage();
        this.endGamePage = objective;
        return objective;
    }
    addPlayer(id, username) {
        const player = new Player(id, username);
        this.players[username]=player;
    }
    removePlayer(id) {
        for (const username in this.players) {
            if (this.players[username].id === id) {
                delete this.players[username];
                break;
            }
        }
    }
    getPlayers() {
        return Object.values(this.players);
    }
    getPlayerInfos(player){
        return this.players[player].getPlayerInfo();
    }
    startGame() {
        this.isStarted = true;
    }
}