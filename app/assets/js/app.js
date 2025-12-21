import { Utils } from "./Utils.js";

let currentCode = null;

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
    }

    if( gameCode.trim() !== "" && type === 'join'){
        console.log(username +"is joining game with code: " + gameCode);
        socket.emit("joinGame",({ code: gameCode, pseudo: username }));
    }else{
        errorModal.innerHTML += '<p class="error"> Error while joining the game.</p>';
    }

    if (type === 'create'){
        socket.emit("createGame",username);
        console.log(username +"is creating a new game");
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

    console.log("----- \n",htmlContent,"\n -----");

});

socket.on("updateScores", (scores) => {
    console.log("Scores updated:", scores);
    const playerContainer = document.getElementById("playerContainer");
    playerContainer.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
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

    const finalURL = "https://en.wikipedia.org" + url.pathname

    console.log("redirecting to : ", finalURL)
    socket.emit("redirectPage",({code : currentCode, url : finalURL}))
  });
