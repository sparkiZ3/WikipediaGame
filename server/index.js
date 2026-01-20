import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { WikiGame } from "./game/WikiGame.js";
import { Utils } from "./utils/Utils.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static("../app"));

let games = {}; //dict of all Games

function generateCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 4; i++) code += letters[Math.floor(Math.random() * letters.length)];
    return code;
}

io.on("connection", (socket) => {
    console.log("🟢 Nouveau joueur :", socket.id);

    socket.on("createGame", async (pseudo) => {
        console.log(`${pseudo} is creating a new game`);
        const code = generateCode();
        games[code] = await new WikiGame(code).initGame();
        socket.join(code);
        games[code].addPlayer(socket.id, pseudo, true);
        socket.emit("gameJoined", code);
        console.log("nombre total de parties: ", Object.keys(games).length);
        io.to(code).emit("initGame", games[code].getGameInfo());
        io.to(code).emit("updateScores", games[code].getPlayers());
    });

    socket.on("joinGame", async ({ code, pseudo }) => {
        console.log(`${pseudo} is trying to join game ${code}`);
        if (!games[code]) {
            socket.emit("errorMsg", "Partie introuvable !");
            return;
        } else if (games[code].isStarted) {
            socket.emit("errorMsg", "La partie a déjà commencé !");
            return;
        }
        socket.join(code);
        games[code].addPlayer(socket.id, pseudo);
        socket.emit("gameJoined", code);
        io.to(code).emit("updateScores", games[code].getPlayers());
        io.to(code).emit("initGame", games[code].getGameInfo());
        //const pageContent = await Utils.getWikipediaPage(games[code].getGameInfo().startGamePage.url);
        //io.to(code).emit("redirectPage", pageContent);
    });
    socket.on("startGame", async ({ code }) => {
        const game = games[code]
        game.startGame()

        const pageContent = await Utils.getWikipediaPage(games[code].getGameInfo().startGamePage.url);
        io.to(code).emit("redirectPage", pageContent);
    });
    socket.on("getNewObjective", async (code) => {
        const game = games[code]
        const newObjective = await game.setNewObjective();
        console.log("new objective set:", newObjective.title)
        console.log("new objective set:", newObjective.url)
        io.to(code).emit("getNewObjective", newObjective);
    });
    socket.on("redirectPage", async ({ code, url, username }) => {
        const game = games[code]
        game.linkClicked(username,url);
        if (url === games[code].endGamePage.url) {
            game.endGame();
            io.to(code).emit("endGame", {winnerData : game.getPlayerInfos(username), gameData : {time: game.getGameDuration()} });
            io.to(code).emit("updateScores", games[code].getPlayers());
            return;
        }
        const pageContent = await Utils.getWikipediaPage(url);
        if (pageContent) {
            socket.emit("redirectPage", pageContent);
            io.to(code).emit("updateScores", games[code].getPlayers());
        }
    });
    socket.on("restartGame", async (code) => {
        const game = games[code]
        await game.initGame();
        io.to(code).emit("initGame", games[code].getGameInfo());
    });
    socket.on("disconnect", () => {
        console.log("🔴 Player disconnected :", socket.id);
        for (const code in games) {
            games[code].removePlayer(socket.id);
            io.to(code).emit("updateScores", games[code].getPlayers());
            if (games[code].getPlayers().length === 0) {
                delete games[code];
                console.log(`Game : ${code} deleted (empty)`);
            }
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));