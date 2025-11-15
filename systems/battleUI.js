window.battleUI = {
  container: null,

  init() {
    // --- 戦闘画面の親要素を作成 ---
    this.container = document.createElement("div");
    this.container.id = "battleScreen";
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.width = "900px";
    this.container.style.height = "450px";
    this.container.style.background = "rgba(0, 0, 0, 0.8)";
    this.container.style.color = "white";
    this.container.style.display = "none";
    this.container.style.flexDirection = "column";
    this.container.style.justifyContent = "space-between";
    this.container.style.alignItems = "center";
    this.container.style.padding = "20px";

    // --- 中身を作る ---
    this.container.innerHTML = `
      <div id="enemyArea">
        <img id="battleEnemyImage" src="" alt="敵" width="128" height="128">
        <div id="battleEnemyName"></div>
      </div>

      <div id="playerArea">
        <div id="battlePlayerStatus"></div>
      </div>

      <div id="battleCommands">
        <button id="attackButton">攻撃</button>
        <button id="runButton">逃げる</button>
      </div>
    `;

    document.body.appendChild(this.container);
  },

  show(enemy) {
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "none";

    this.container.style.display = "flex";

    document.getElementById("battleEnemyName").textContent = enemy.id;
    document.getElementById("battleEnemyImage").src = enemy.img || "images/defaultEnemy.png";
    document.getElementById("battlePlayerStatus").textContent =
      `HP: ${playerStatus.hp} / ${playerStatus.maxHp}`;
  },

  hide() {
    this.container.style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
  }
};

// ページロード時にUIを初期化
window.addEventListener("load", () => battleUI.init());
