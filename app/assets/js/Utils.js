export class Utils {
    static renderScores(scores) {
        const playerList = document.getElementById("playerContainer");
        playerList.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
    }

    static getHTMLPlayerInfos(player) {
        return `
            <div class="playerCard">
                <span class="playerName">${player.username}</span>
                <span class="playerTime">clicks : ${player.clicks}</span>
            </div>
        `;
    }
    static setWinnerPageHTML(winner) {
        return `
        <div class="winner-page">
            <h1>${winner.username} à gagné la partie !</h1>
            <p>Nombre de clicks : ${winner.clicks}</p>
            <h2>Historique des pages visitées :</h2>
            <ul>
                ${winner.history.map(page => `<li><a href="${page.url}" target="_blank">${page.title}</a></li>`).join("")}
            </ul>
            <button id="restartButton">Rejouer</button>
        </div>
        `;
    }
}
