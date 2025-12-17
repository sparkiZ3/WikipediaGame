export class Utils{
    static renderScores(scores){
        const playerList = document.getElementById("playerContainer");
        playerList.innerHTML = scores.map(player => Utils.getHTMLPlayerInfos(player)).join("");
    }

    static getHTMLPlayerInfos(player){
        return `
            <div class="playerCard">
                <span class="playerName">${player.username}</span>
                <span class="playerTime">clicks : ${player.clicks}</span>
            </div>
        `;
    }
}
