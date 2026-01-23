export class Utils {
    static renderScores(scores) {
        const playerList = document.getElementById("playerContainer");
        playerList.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
    }

    static getStartPageHTML(isOwner=false) {
        if (isOwner){
        return `
        <div class="startGamePage">
            <h1>Bienvenue !</h1>
                <div class="row">
                    <p>Votre objectif : <a class="ignoreLinkRestriction" id="target-page2">X</a></p>
                </div>
                <h2>Nouvel objectif :</h2>
                <div class="row">
                    <button id="refreshRandomObjectiveButton" class="refreshObjectiveButton">Random</button>
                    <button id="refreshRandomObjectiveButton" class="refreshObjectiveButton" disabled>Pages connues</button>
                </div>
                
                <p>Custom page :</p>
                <div class="row">
                    <input type="text" id="customObjectiveInput" placeholder="ex : https://fr.wikipedia.org/wiki/..."/>
                    <button id="setCustomObjectiveButton" class="setCustomObjectiveButton">-></button>
                </div>
                
                <div id="startGameButton" class="startGameButton">
                    <p>Commencer la partie !</p>
                </div>
            </div>`
        }else{
            return `
            <div class="startGamePage">
                <h1>Bienvenue !</h1>
                    <div class="row">
                        <p>Votre objectif : <a class="ignoreLinkRestriction" id="target-page2">X</a></p>
                    </div>
                    <h2>En attente du lancement de la partie...</h2>
                </div>`
        }
    }

    static getHTMLPlayerInfos(player) {
        return `
            <div class="playerCard">
                <div class="row playerNameContainer">
                    ${player.isOwner ? `<svg id="ownerSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M345 151.2C354.2 143.9 360 132.6 360 120C360 97.9 342.1 80 320 80C297.9 80 280 97.9 280 120C280 132.6 285.9 143.9 295 151.2L226.6 258.8C216.6 274.5 195.3 278.4 180.4 267.2L120.9 222.7C125.4 216.3 128 208.4 128 200C128 177.9 110.1 160 88 160C65.9 160 48 177.9 48 200C48 221.8 65.5 239.6 87.2 240L119.8 457.5C124.5 488.8 151.4 512 183.1 512L456.9 512C488.6 512 515.5 488.8 520.2 457.5L552.8 240C574.5 239.6 592 221.8 592 200C592 177.9 574.1 160 552 160C529.9 160 512 177.9 512 200C512 208.4 514.6 216.3 519.1 222.7L459.7 267.3C444.8 278.5 423.5 274.6 413.5 258.9L345 151.2z"/></svg>` : ``}
                    <span  class="playerName">${player.username}</span>
                </div>
                <span class="playerClicks">clicks : ${player.clicks}</span>
            </div>
        `;
    }
    static setWinnerPageHTML(winner, gameData) {
        if(gameData.time > 60){
            gameData.time = Math.floor(gameData.time / 60) + " minutes et " + (gameData.time % 60) + " secondes"
        }else{
            gameData.time = gameData.time + " secondes"
        }
        return `
        <div class="winner-page">
            <h1>${winner.username} à gagné la partie !</h1>
            <div class="row">
                <div class="statDiv">
                    <p> ${winner.clicks} clicks</p>
                </div>
                <div class="statDiv">
                    <p> ${gameData.time}</p>
                </div>
            </div>
            <h2>Historique des pages visitées :</h2>
            <ul>
                ${winner.history.map(page => `<li><a href="${page.url}" class="ignoreLinkRestriction">${page.title}</a></li>`).join("")}
            </ul>
            <button id="restartButton">Rejouer</button>
        </div>
        `;
    }
    static getLoadingHTML() {
        return `
        <div class="mw-page-container-inner">
            <div class="mw-content-container">
                <div class="loadingContainer">
                    <div class="loadingTitle"></div>
                    <hr>
                    <div class="rowLoading">
                        <div class="columnLoadingText">
                            <div class="loadingText"></div>
                            <div class="loadingText"></div>
                            <div class="loadingText"></div>
                        </div>
                        <div class="loadingMenu"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
