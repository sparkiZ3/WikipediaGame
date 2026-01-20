import { Player } from "./Player.js";
import { Utils } from "../utils/Utils.js";

export class WikiGame {
    constructor(code) {
        this.codeGame = code;
        this.players = {};
        this.isStarted = false;
        this.initGame();
        this.startedAt = null;
        this.finishedAt = null;
    }
    async initGame() {
        this.startGamePage = await Utils.getRandomWikipediaPage();
        //this.endGamePage = await Utils.getRandomWikipediaPage();
        this.endGamePage = {
            "title":"France",
            "url":"https://fr.wikipedia.org/wiki/France"
        };
        this.startedAt = null;
        this.finishedAt = null;
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
            const pageName = decodeURIComponent(splitURL[splitURL.length - 1]);
            pageName.replace("_", " ");
            return {
                title: pageName,
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
    addPlayer(id, username, isOwner=false) {
        const player = new Player(id, username, isOwner);
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
        this.startedAt = new Date();
    }
    endGame(){
        this.isStarted = false;
        this.finishedAt = new Date();
    }
    getGameDuration(){
        if (this.startedAt && this.finishedAt){
            return Math.floor((this.finishedAt - this.startedAt)/1000);
        }
        return null;
    }
    isPlayerOwner(username){
        const player = this.players[username];
        if (player){
            return player.isOwner;
        }
        return false;
    }
}