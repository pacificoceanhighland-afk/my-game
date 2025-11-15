// --- battle.js ---

window.startBattle = function(enemy) {
  console.log(`${enemy.id} が現れた！`);

  // 🔹既存の戦闘画面があれば削除（←重要！）
  const oldScreen = document.getElementById("battleScreen");
  if (oldScreen) oldScreen.remove();

  window.currentEnemy = {
    id: enemy.id,
    name: enemy.name || enemy.id,
    hp: enemy.hp || 100,
    maxHp: enemy.hp || 100,
    attack: enemy.attack || 5,
    exp: enemy.exp || 10,
    x: enemy.x,
    y: enemy.y
  };

  // 戦闘画面作成
  const battleDiv = document.createElement("div");
  battleDiv.id = "battleScreen";
  Object.assign(battleDiv.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.9)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000"
  });

  battleDiv.innerHTML = `
    <h2>${currentEnemy.name} が現れた！</h2>
    <p id="enemyHp">敵HP：${currentEnemy.hp} / ${currentEnemy.maxHp}</p>
    <p id="playerHp">自分HP：${playerStatus.hp} / ${playerStatus.maxHp}</p>
    <div>
      <button id="attackBtn">攻撃</button>
      <button id="runBtn">逃げる</button>
    </div>
    <p id="battleLog"></p>
  `;
  document.body.appendChild(battleDiv);

  const log = document.getElementById("battleLog");
  let attackTimeout = null; // ← 敵の攻撃予約をキャンセルするための変数

  // --- 表示更新 ---
  function updateDisplay() {
    if (!currentEnemy) return;
    document.getElementById("enemyHp").textContent =
      `敵HP：${currentEnemy.hp} / ${currentEnemy.maxHp}`;
    document.getElementById("playerHp").textContent =
      `自分HP：${playerStatus.hp} / ${playerStatus.maxHp}`;
  }

  // --- 敵の反撃 ---
  function enemyAttack() {
    if (!currentEnemy || currentEnemy.hp <= 0) return;

    const dmg = Math.floor(Math.random() * currentEnemy.attack) + 1;
    playerStatus.hp -= dmg;
    updateDisplay();

    log.textContent = `${currentEnemy.name} の攻撃！ あなたは ${dmg} のダメージを受けた！`;

    if (playerStatus.hp <= 0) {
      window.endBattle("lose");
    }
  }

  // --- 攻撃ボタン ---
  document.getElementById("attackBtn").onclick = function() {
    if (!currentEnemy || playerStatus.hp <= 0) return;

    const dmg = Math.floor(Math.random() * playerStatus.totalAttack) + 1;
    currentEnemy.hp -= dmg;
    updateDisplay();
    log.textContent = `${currentEnemy.name} に ${dmg} のダメージ！`;

    if (currentEnemy.hp <= 0) {
      if (attackTimeout) clearTimeout(attackTimeout); // ← 反撃をキャンセル
      window.endBattle("win");
      return;
    }

    attackTimeout = setTimeout(enemyAttack, 800);
  };

  // --- 逃げるボタン ---
  document.getElementById("runBtn").onclick = function() {
    if (attackTimeout) clearTimeout(attackTimeout);
    window.endBattle("run");
  };
};

// --- 戦闘終了 ---
window.endBattle = function(result) {
  const log = document.getElementById("battleLog");
  if (!log) return;

  if (result === "win") {
    log.textContent = "敵を倒した！";
    playerStatus.gainExp(currentEnemy.exp);
    playerStatus.heal(5);

    // マップから敵を削除
    if (currentMap.enemies) {
      const index = currentMap.enemies.findIndex(
        e => e.id === currentEnemy.id && e.x === currentEnemy.x && e.y === currentEnemy.y
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

  // --- 戦闘終了画面を確実に消す ---
  setTimeout(() => {
    const screen = document.getElementById("battleScreen");
    if (screen) screen.remove();
    window.currentEnemy = null;
  }, result === "win" ? 600 : 1500);
};

// --- ゲームオーバー ---
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
}
