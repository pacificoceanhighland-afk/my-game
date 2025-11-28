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

    const enemyPercent = Math.max(0, this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
    const playerPercent = Math.max(0, playerStatus.hp / playerStatus.maxHp) * 100;

    document.getElementById("enemyHpFill").style.width = enemyPercent + "%";
    document.getElementById("playerHpFill").style.width = playerPercent + "%";

    document.getElementById("battlePlayerStatus").textContent =
      `HP: ${playerStatus.hp} / ${playerStatus.maxHp}`;
  },

  // プレイヤー攻撃
  playerAttack() {
    if (!this.currentEnemy || playerStatus.hp <= 0) return;

    const dmg = Math.floor(Math.random() * playerStatus.totalAttack) + 1;
    this.currentEnemy.hp -= dmg;
    if (this.currentEnemy.hp < 0) this.currentEnemy.hp = 0;

    this.updateDisplay();
    document.getElementById("battleLog").textContent =
      `${this.currentEnemy.name} に ${dmg} のダメージ！`;

    if (this.currentEnemy.hp <= 0) {
      if (this.attackTimeout) clearTimeout(this.attackTimeout);
      this.endBattle("win");
      return;
    }

    // 敵反撃
    this.attackTimeout = setTimeout(() => this.enemyAttack(), 800);
  },

  // 敵の反撃
  enemyAttack() {
    if (!this.currentEnemy || this.currentEnemy.hp <= 0) return;

    const dmg = Math.floor(Math.random() * this.currentEnemy.attack) + 1;
    playerStatus.hp -= dmg;
    if (playerStatus.hp < 0) playerStatus.hp = 0;

    this.updateDisplay();
    document.getElementById("battleLog").textContent =
      `${this.currentEnemy.name} の攻撃！ あなたは ${dmg} のダメージを受けた！`;

    if (playerStatus.hp <= 0) {
      this.endBattle("lose");
    }
  },

  // 戦闘終了
  endBattle(result) {
    if (this.attackTimeout) clearTimeout(this.attackTimeout);

    const log = document.getElementById("battleLog");

    if (result === "win") {
      log.textContent = "敵を倒した！";
      playerStatus.gainExp(this.currentEnemy.exp || 10);
      playerStatus.heal(5);

      // マップから敵削除
      if (currentMap.enemies) {
        const index = currentMap.enemies.findIndex(
          e => e.id === this.currentEnemy.id && e.x === this.currentEnemy.x && e.y === this.currentEnemy.y
        );
        if (index !== -1) currentMap.enemies.splice(index, 1);
      }
    } else if (result === "run") {
      log.textContent = "逃げ出した…！";
    } else if (result === "lose") {
      log.textContent = "力尽きた……";
      showGameOver();
      return;
    }

    setTimeout(() => this.hide(), result === "win" ? 600 : 1500);
  }
};

// 初期化
window.addEventListener("load", () => battleUI.init());
