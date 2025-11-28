// 戦闘開始
window.startBattle = function(enemy) {
  console.log(`${enemy.id} が現れた！`);
  // currentEnemy を battleUI に設定
  battleUI.currentEnemy = { ...enemy };
  battleUI.show(battleUI.currentEnemy);
};

// プレイヤー攻撃
window.battleUI.playerAttack = function() {
  if (!this.currentEnemy || playerStatus.hp <= 0) return;

  // ダメージ計算
  const dmg = Math.floor(Math.random() * playerStatus.totalAttack) + 1;
  this.currentEnemy.hp -= dmg;
  if (this.currentEnemy.hp < 0) this.currentEnemy.hp = 0;

  this.updateDisplay();
  document.getElementById("battleLog").textContent =
    `${this.currentEnemy.name} に ${dmg} のダメージ！`;

  // 敵が倒れたら戦闘終了
  if (this.currentEnemy.hp <= 0) {
    if (this.attackTimeout) clearTimeout(this.attackTimeout);
    this.endBattle("win");
    return;
  }

  // 敵の反撃をセット
  this.attackTimeout = setTimeout(() => this.enemyAttack(), 800);
};

// 敵の反撃
window.battleUI.enemyAttack = function() {
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
};

// 戦闘終了
window.battleUI.endBattle = function(result) {
  if (this.attackTimeout) clearTimeout(this.attackTimeout);

  const log = document.getElementById("battleLog");

  if (result === "win") {
    log.textContent = "敵を倒した！";
    playerStatus.gainExp(this.currentEnemy.exp || 10);
    playerStatus.heal(5);

    // マップから敵を削除
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
};

// ゲームオーバー
function showGameOver() {
  const overDiv = document.createElement("div");
  overDiv.id = "gameOverScreen";
  Object.assign(overDiv.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "black",
    color: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    zIndex: "2000"
  });
  overDiv.textContent = "GAME OVER";
  document.body.appendChild(overDiv);

  setTimeout(() => {
    playerStatus.hp = playerStatus.maxHp;
    overDiv.remove();
  }, 3000);
};
