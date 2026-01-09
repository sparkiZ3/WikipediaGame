import { Utils } from "./Utils.js";

let currentCode = null;
let currentUsername = null;

const socket = io("http://localhost:3000", {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 5000
});



function submitModal(type){
    const errorModal = document.getElementById('errorModal');
    errorModal.innerHTML = '';
    const username = document.getElementById('username').value;
    const gameCode = document.getElementById('room-code').value;
    if (username.trim() === "") {
        errorModal.innerHTML += '<p class="error"> Veuillez entrer un pseudo valide.</p>';
        return
    }else{
        currentUsername = username
    }

    if(type === 'join' ){
        console.log(username +"is joining game with code: " + gameCode);
        socket.emit("joinGame",({ code: gameCode, pseudo: username }));
    }else if (type === 'create'){
        const loader = document.getElementById("loader")
        const createButton = document.getElementById("createButton")
        socket.emit("createGame",username);
        loader.style.display = 'flex';
        createButton.disabled = true;
        console.log(username +"is creating a new game");
    }else{
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
});

socket.on("updateScores", (scores) => {
    console.log("Scores updated:", scores);
    const playerContainer = document.getElementById("playerContainer");
    playerContainer.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
});

socket.on("initGame", (data) => {
    const targetPage = document.getElementById("target-page");
    targetPage.innerText = data.endGamePage.title
    console.log("init data:", data);
});

socket.on("endGame",(winner) => {
    console.log("game ended. Winner is :", winner)
});

window.submitModal = submitModal;

document.addEventListener("click", function (event) {
    const target = event.target;

    const lien = target.closest("a");

    console.log(lien)

    if (!lien) return; // ce n’est pas un lien → on ignore

    event.preventDefault(); // bloque la navigation si nécessaire

    // Code exécuté pour TOUS les liens
    const url = new URL(lien.href)

    const finalURL = "https://fr.wikipedia.org" + url.pathname

    console.log("redirecting to : ", finalURL)
    socket.emit("redirectPage",({code : currentCode, url : finalURL, username : currentUsername}))
  });
