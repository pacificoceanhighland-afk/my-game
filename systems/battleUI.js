// --- battleUI.js ---
window.battleUI = {
  container: null,
  currentEnemy: null,
  attackTimeout: null,

  init() {
    // --- 戦闘画面の親要素を作成 ---
    this.container = document.createElement("div");
    this.container.id = "battleScreen";
    Object.assign(this.container.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "900px",
      height: "450px",
      background: "rgba(0, 0, 0, 0.8)",
      color: "white",
      display: "none",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px"
    });

    // --- 中身を作る ---
    this.container.innerHTML = `
      <div id="enemyArea">
        <img id="battleEnemyImage" src="" alt="敵" width="128" height="128">
        <div id="battleEnemyName"></div>
        <p id="enemyHp"></p>
      </div>

      <div id="playerArea">
        <div id="battlePlayerStatus"></div>
      </div>

      <div id="battleCommands">
        <button id="attackButton">攻撃</button>
        <button id="runButton">逃げる</button>
      </div>

      <p id="battleLog"></p>
    `;

    document.body.appendChild(this.container);

    // --- ボタン処理 ---
    document.getElementById("attackButton").onclick = () => this.playerAttack();
    document.getElementById("runButton").onclick = () => this.endBattle("run");
  },

  show(enemy) {
    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.style.display = "none";

    this.container.style.display = "flex";

    this.currentEnemy = {
      id: enemy.id,
      name: enemy.name || enemy.id,
      hp: enemy.hp || 100,
      maxHp: enemy.hp || 100,
      attack: enemy.attack || 5,
      exp: enemy.exp || 10,
      x: enemy.x,
      y: enemy.y
    };

    document.getElementById("battleEnemyName").textContent = this.currentEnemy.name;
    document.getElementById("battleEnemyImage").src = enemy.img || "images/defaultEnemy.png";
    this.updateDisplay();
  },

  hide() {
    this.container.style.display = "none";
    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.style.display = "block";
    this.currentEnemy = null;
    if (this.attackTimeout) clearTimeout(this.attackTimeout);
  },

  updateDisplay() {
    if (!this.currentEnemy) return;
    document.getElementById("enemyHp").textContent =
      `敵HP：${this.currentEnemy.hp} / ${this.currentEnemy.maxHp}`;
    document.getElementById("battlePlayerStatus").textContent =
      `HP: ${playerStatus.hp} / ${playerStatus.maxHp}`;
  }
};

// ページロード時にUIを初期化
window.addEventListener("load", () => battleUI.init());
