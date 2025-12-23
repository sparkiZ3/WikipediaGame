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

app.use(express.static("public"));

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
        games[code].addPlayer(socket.id, pseudo);
        socket.emit("gameJoined", code);
        //io.to(code).emit("updateScores", games[code].players);
        console.log("nombre total de parties: ", Object.keys(games).length);
    });

    socket.on("joinGame", async ({ code,pseudo }) => {
        console.log(`${pseudo} is trying to join game ${code}`);
        if (!games[code]) {
            socket.emit("errorMsg", "Partie introuvable !");
            return;
        }
        socket.join(code);
        games[code].addPlayer(socket.id, pseudo);
        socket.emit("gameJoined", code);
        io.to(code).emit("updateScores", games[code].getPlayers());
        console.log("update data :",games[code].getGameInfo())
        io.to(code).emit("initGame", games[code].getGameInfo());
        console.log(Utils.getWikipediaPage(games[code].getGameInfo().startGamePage.url))
        const pageContent = await Utils.getWikipediaPage(games[code].getGameInfo().startGamePage.url);
        io.to(code).emit("redirectPage", pageContent);
    });

    socket.on("redirectPage" , async ({ code, url }) => {
        const pageContent = await Utils.getWikipediaPage(url);
        socket.emit("redirectPage", pageContent);
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