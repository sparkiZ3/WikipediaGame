import { Utils } from "./Utils.js";

let currentCode = null;
let currentUsername = null;
let isNewObjectiveLoading = false;
let gameStarted = false;

const disableCTRLF = false

//set server URL
const { protocol, hostname, port } = window.location;
const SERVER = `${protocol}//${hostname}${port ? `:${port}` : ""}`;

console.log("Connecting to server at:", SERVER);


// Retrieve username from localStorage
var username = localStorage.getItem("username");
const usernameContainer = document.getElementById('username');
usernameContainer.value = username ? username : '';

// Initialize socket connection
const socket = io(SERVER, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 5000
});

//update objective display
function updateObjectives(newObjective) {
    if (isNewObjectiveLoading){
        newObjective.title = `<svg class="animatedLoader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/></svg>`
    }
    const targetPage = document.getElementById("target-page");
    const targetPage2 = document.getElementById("target-page2");
    targetPage.innerHTML = newObjective.title;
    targetPage2.innerHTML = newObjective.title;
    targetPage2.href = newObjective.url;
}

//handle modal submission
function submitModal(type) {
    const errorModal = document.getElementById('errorModal');
    errorModal.innerHTML = '';
    const username = document.getElementById('username').value;
    const gameCode = document.getElementById('room-code').value;
    //check valid username
    if (username.trim() === "") {
        errorModal.innerHTML += '<p class="error"> Veuillez entrer un pseudo valide.</p>';
        return
    } else {
        currentUsername = username
        localStorage.setItem("username", currentUsername);
    }

    //create or join game
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

//if a game is joined : hide modal
socket.on("gameJoined", (code) => {
    console.log("Game joined with code:", code);
    const roomDiv = document.getElementById('room');
    roomDiv.textContent = `#${code}`;
    currentCode = code;
    document.title = `WikiGame - ${code}`;
    document.getElementById('join-modal').style.display = 'none';
});

//initialize game UI on initGame event
socket.on("initGame", (data) => {
    const pageContainer = document.getElementById("pageContainer");
    pageContainer.innerHTML = Utils.getStartPageHTML(data.owner === currentUsername);
    console.log("Updating objectives with:", data.endGamePage.title);
    updateObjectives(data.endGamePage);
    console.log("init data:", data);

    //start game button listener
    const startGameButton = document.getElementById("startGameButton");
    const refreshRandomObjectiveButton = document.getElementById("refreshRandomObjectiveButton");
    startGameButton.addEventListener("click", () => {
        socket.emit("startGame", ({ code: currentCode }));
    });

    refreshRandomObjectiveButton.addEventListener("click", () => {
        if (isNewObjectiveLoading) {
            console.log("already loading new objective");
            return;
        };
        isNewObjectiveLoading = true;
        updateObjectives({title :"IsL0ading..."});
        socket.emit("getNewObjective", ({code : currentCode,username : currentUsername}));
    });
});

//update players scores on updateScores event
socket.on("updateScores", (scores) => {
    console.log("Scores updated:", scores);
    const playerContainer = document.getElementById("playerContainer");
    playerContainer.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
});

//load new wikipedia page and display it
socket.on("redirectPage", (htmlContent) => {
    const pageContainer = document.getElementById("pageContainer");
    pageContainer.innerHTML = htmlContent;
    pageContainer.scrollTo(0, 0);
});

//display winner page 
socket.on("endGame", (data) => {
    gameStarted = false;
    const { winnerData, gameData } = data;
    console.log("game ended. Winner is :", winnerData)
    const pageContainer = document.getElementById("pageContainer");
    pageContainer.innerHTML = Utils.setWinnerPageHTML(winnerData,gameData);
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
        socket.emit("restartGame", currentCode);
    });
});

//update target page
socket.on("getNewObjective", (newObjective) => {
    isNewObjectiveLoading = false;
    console.log("new objective received:", newObjective)
    updateObjectives(newObjective);
});

//display error messages from server
socket.on("errorMsg", (msg) => {
    console.log("Error:", msg);
});

window.submitModal = submitModal;

//handle link clicks in wikipedia content
document.addEventListener("click", function (event) {
    const pageContainer = document.getElementById("pageContainer");
    const target = event.target;

    const lien = target.closest("a");

    if (!lien) return; // ce n’est pas un lien → on ignore

    event.preventDefault(); 

    //check if link should be opened in new tab and bypass restrictions
    if (lien.classList.contains("ignoreLinkRestriction")){
        window.open(lien.href, '_blank');
        return;
    }

    //build url and emit redirectPage event
    const url = new URL(lien.href)
    const finalURL = "https://fr.wikipedia.org" + url.pathname

    //disbale loading animation because it causes issues if the page fail to load
    //pageContainer.innerHTML = Utils.getLoadingHTML();
    console.log("redirecting to : ", finalURL)
    socket.emit("redirectPage", ({ code: currentCode, url: finalURL, username: currentUsername }))
});

//disable CTRL+F / CMD+F
document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f" && disableCTRLF) {
        e.preventDefault();
    }
});





