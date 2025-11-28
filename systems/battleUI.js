window.battleUI = {
  container: null,
  currentEnemy: null,
  attackTimeout: null,

  init() {
    // 戦闘画面の親要素を作成
    this.container = document.createElement("div");
    this.container.id = "battleScreen";
    Object.assign(this.container.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      display: "none",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px",
      zIndex: "1000"
    });

    this.container.innerHTML = `
      <div id="enemyArea">
        <img id="battleEnemyImage" src="" alt="敵" width="128" height="128">
        <div id="battleEnemyName"></div>
        <div id="enemyHpBar" style="width:200px; height:20px; background:#555; margin-top:5px;">
          <div id="enemyHpFill" style="height:100%; background:#f00; width:100%;"></div>
        </div>
      </div>

      <div id="playerArea">
        <div id="battlePlayerStatus"></div>
        <div id="playerHpBar" style="width:200px; height:20px; background:#555; margin-top:5px;">
          <div id="playerHpFill" style="height:100%; background:#0f0; width:100%;"></div>
        </div>
      </div>

      <div id="battleCommands">
        <button id="attackButton">攻撃</button>
        <button id="runButton">逃げる</button>
      </div>

      <p id="battleLog"></p>
    `;

    document.body.appendChild(this.container);

    // ボタンイベント
    document.getElementById("attackButton").onclick = () => this.playerAttack();
    document.getElementById("runButton").onclick = () => this.endBattle("run");
  },

  show(enemy) {
    this.currentEnemy = { ...enemy }; // 現在の敵を保持
    document.getElementById("gameCanvas").style.display = "none";
    this.container.style.display = "flex";

    document.getElementById("battleEnemyName").textContent = enemy.name || enemy.id;
    document.getElementById("battleEnemyImage").src = enemy.img || "images/defaultEnemy.png";

    this.updateDisplay();
    document.getElementById("battleLog").textContent = `${enemy.name || enemy.id} が現れた！`;
  },

  hide() {
    this.container.style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    this.currentEnemy = null;
    if (this.attackTimeout) clearTimeout(this.attackTimeout);
    this.attackTimeout = null;
  },

  updateDisplay() {
    if (!this.currentEnemy) return;

    // HPバー更新
    const enemyPercent = Math.max(0, this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
    const playerPercent = Math.max(0, playerStatus.hp / playerStatus.maxHp) * 100;

    document.getElementById("enemyHpFill").style.width = enemyPercent + "%";
    document.getElementById("playerHpFill").style.width = playerPercent + "%";

    // テキスト表示
    document.getElementById("battlePlayerStatus").textContent =
      `HP: ${playerStatus.hp} / ${playerStatus.maxHp}`;
  }
};

// 初期化
window.addEventListener("load", () => battleUI.init());
