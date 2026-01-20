export class Utils {
    static renderScores(scores) {
        const playerList = document.getElementById("playerContainer");
        playerList.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
    }

    static getStartPageHTML() {
        return `
        <div class="startGamePage">
            <h1>Bienvenue !</h1>
                <div class="row">
                    <p>Votre objectif : <strong id="target-page2">Pipit de Sibérie</strong></p>
                    <svg id="refreshObjective" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/></svg>
                </div>
                <div id="startGameButton" class="startGameButton">
                    <p>Commencer la partie !</p>
                </div>
            </div>`
    }

    static getHTMLPlayerInfos(player) {
        return `
            <div class="playerCard">
                <div class="row playerNameContainer">
                    ${ player.isOwner ? `<svg id="ownerSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M345 151.2C354.2 143.9 360 132.6 360 120C360 97.9 342.1 80 320 80C297.9 80 280 97.9 280 120C280 132.6 285.9 143.9 295 151.2L226.6 258.8C216.6 274.5 195.3 278.4 180.4 267.2L120.9 222.7C125.4 216.3 128 208.4 128 200C128 177.9 110.1 160 88 160C65.9 160 48 177.9 48 200C48 221.8 65.5 239.6 87.2 240L119.8 457.5C124.5 488.8 151.4 512 183.1 512L456.9 512C488.6 512 515.5 488.8 520.2 457.5L552.8 240C574.5 239.6 592 221.8 592 200C592 177.9 574.1 160 552 160C529.9 160 512 177.9 512 200C512 208.4 514.6 216.3 519.1 222.7L459.7 267.3C444.8 278.5 423.5 274.6 413.5 258.9L345 151.2z"/></svg>` : ``}
                    <span  class="playerName">${player.username}</span>
                </div>
                <span class="playerClicks">clicks : ${player.clicks}</span>
            </div>
        `;
    }
    static setWinnerPageHTML(winner,gameData) {
        return `
        <div class="winner-page">
            <h1>${winner.username} à gagné la partie !</h1>
            <div class="row">
                <div class="statDiv">
                    <p> ${winner.clicks} clicks</p>
                </div>
                <div class="statDiv">
                    <p> ${gameData.time} secondes</p>
                </div>
            </div>
            <h2>Historique des pages visitées :</h2>
            <ul>
                ${winner.history.map(page => `<li><a href="${page.url}" target="_blank">${page.title}</a></li>`).join("")}
            </ul>
            <button id="restartButton">Rejouer</button>
        </div>
        `;
    }
}
