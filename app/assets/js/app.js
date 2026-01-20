import { Utils } from "./Utils.js";

let currentCode = null;
let currentUsername = null;

const disableCTRLF = false

const { protocol, hostname, port } = window.location;
const SERVER = `${protocol}//${hostname}${port ? `:${port}` : ""}`;

console.log("Connecting to server at:", SERVER);

const socket = io(SERVER, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 5000
});

function updateObjectives(newObjective) {
    const targetPage = document.getElementById("target-page");
    const targetPage2 = document.getElementById("target-page2");
    targetPage.innerText = newObjective
    targetPage2.innerText = newObjective
}
var username = localStorage.getItem("username");
const usernameContainer = document.getElementById('username');
usernameContainer.value = username ? username : '';

function submitModal(type) {
    const errorModal = document.getElementById('errorModal');
    errorModal.innerHTML = '';
    const username = document.getElementById('username').value;
    const gameCode = document.getElementById('room-code').value;
    if (username.trim() === "") {
        errorModal.innerHTML += '<p class="error"> Veuillez entrer un pseudo valide.</p>';
        return
    } else {
        currentUsername = username
        localStorage.setItem("username", currentUsername);
    }

    if (type === 'join') {
        console.log(username + "is joining game with code: " + gameCode);
        socket.emit("joinGame", ({ code: gameCode, pseudo: username }));
    } else if (type === 'create') {
        const loader = document.getElementById("loader")
        const createButton = document.getElementById("createButton")
        socket.emit("createGame", username);
        loader.style.display = 'flex';
        createButton.disabled = true;
        console.log(username + "is creating a new game");
    } else {
        errorModal.innerHTML += '<p class="error"> Impossible de créer ou rejoindre une partie.</p>';
    }
}


socket.on("gameJoined", (code) => {
    console.log("Game joined with code:", code);
    const roomDiv = document.getElementById('room');
    roomDiv.textContent = `#${code}`;
    currentCode = code;
    document.title = `WikiGame - ${code}`;
    document.getElementById('join-modal').style.display = 'none';
});

socket.on("redirectPage", (htmlContent) => {
    const pageContainer = document.getElementById("pageContainer");
    pageContainer.innerHTML = htmlContent;
    pageContainer.scrollTo(0, 0);
});

socket.on("updateScores", (scores) => {
    console.log("Scores updated:", scores);
    const playerContainer = document.getElementById("playerContainer");
    playerContainer.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
});

socket.on("initGame", (data) => {
    const pageContainer = document.getElementById("pageContainer");
    pageContainer.innerHTML = Utils.getStartPageHTML();
    console.log("Updating objectives with:", data.endGamePage.title);
    updateObjectives(data.endGamePage.title);
    console.log("init data:", data);

    const startGameButton = document.getElementById("startGameButton");
    const refreshObjective = document.getElementById("refreshObjective");
    startGameButton.addEventListener("click", () => {
        socket.emit("startGame", ({ code: currentCode }));
    });

    refreshObjective.addEventListener("click", () => {
        socket.emit("getNewObjective", currentCode);
    });

});

socket.on("endGame", (data) => {
    const { winnerData, gameData } = data;
    console.log("game ended. Winner is :", winnerData)
    const pageContainer = document.getElementById("pageContainer");
    pageContainer.innerHTML = Utils.setWinnerPageHTML(winnerData,gameData);
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
        socket.emit("restartGame", currentCode);
    });
});
socket.on("getNewObjective", (newObjective) => {
    console.log("new objective received:", newObjective)
    updateObjectives(newObjective.title);
});
socket.on("errorMsg", (msg) => {
    console.log("Error:", msg);
});

window.submitModal = submitModal;

document.addEventListener("click", function (event) {
    const target = event.target;

    const lien = target.closest("a");

    if (!lien) return; // ce n’est pas un lien → on ignore

    event.preventDefault(); // bloque la navigation si nécessaire

    // Code exécuté pour TOUS les liens
    const url = new URL(lien.href)

    const finalURL = "https://fr.wikipedia.org" + url.pathname

    console.log("redirecting to : ", finalURL)
    socket.emit("redirectPage", ({ code: currentCode, url: finalURL, username: currentUsername }))
});

document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f" && disableCTRLF) {
        e.preventDefault();
    }
});





