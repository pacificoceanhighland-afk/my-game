window.startBattle = function(enemy) {
  console.log(`${enemy.id} が現れた！`);

  // 既存の戦闘画面があれば削除
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
    y: enemy.y,
    img: enemy.img || "images/defaultEnemy.png"
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
    zIndex: "1000",
    fontFamily: "sans-serif"
  });

  battleDiv.innerHTML = `
    <div id="enemyArea" style="text-align:center; margin-bottom:20px;">
      <h2>${currentEnemy.name} が現れた！</h2>
      <img id="enemyImage" src="${currentEnemy.img}" style="width:128px; height:128px;"><br>
      <div id="enemyHpBar" style="width:150px; height:16px; border:1px solid #fff; margin:5px auto;">
        <div id="enemyHpFill" style="width:100%; height:100%; background:red;"></div>
      </div>
      <p id="enemyHpText">HP: ${currentEnemy.hp} / ${currentEnemy.maxHp}</p>
    </div>

    <div id="playerArea" style="text-align:center; margin-bottom:20px;">
      <p id="playerHp">HP: ${playerStatus.hp} / ${playerStatus.maxHp}</p>
      <div id="playerHpBar" style="width:150px; height:16px; border:1px solid #fff; margin:5px auto;">
        <div id="playerHpFill" style="width:100%; height:100%; background:green;"></div>
      </div>
    </div>

    <div>
      <button id="attackBtn">攻撃</button>
      <button id="runBtn">逃げる</button>
    </div>
    <p id="battleLog" style="margin-top:10px;"></p>
  `;
  document.body.appendChild(battleDiv);

  const log = document.getElementById("battleLog");
  let attackTimeout = null;

  // 表示更新
  function updateDisplay() {
    if (!currentEnemy) return;
    document.getElementById("enemyHpText").textContent = `HP: ${currentEnemy.hp} / ${currentEnemy.maxHp}`;
    document.getElementById("enemyHpFill").style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;

    document.getElementById("playerHp").textContent = `HP: ${playerStatus.hp} / ${playerStatus.maxHp}`;
    document.getElementById("playerHpFill").style.width = `${(playerStatus.hp / playerStatus.maxHp) * 100}%`;
  }

  // 敵の反撃
  function enemyAttack() {
    if (!currentEnemy || currentEnemy.hp <= 0) return;

    const dmg = Math.floor(Math.random() * currentEnemy.attack) + 1;
    playerStatus.hp -= dmg;
    if (playerStatus.hp < 0) playerStatus.hp = 0;
    updateDisplay();

    log.textContent = `${currentEnemy.name} の攻撃！ あなたは ${dmg} のダメージを受けた！`;

    if (playerStatus.hp <= 0) window.endBattle("lose");
  }

  // 攻撃ボタン
  document.getElementById("attackBtn").onclick = function() {
    if (!currentEnemy || playerStatus.hp <= 0) return;

    const dmg = Math.floor(Math.random() * playerStatus.totalAttack) + 1;
    currentEnemy.hp -= dmg;
    if (currentEnemy.hp < 0) currentEnemy.hp = 0;
    updateDisplay();

    log.textContent = `${currentEnemy.name} に ${dmg} のダメージ！`;

    if (currentEnemy.hp <= 0) {
      if (attackTimeout) clearTimeout(attackTimeout);
      window.endBattle("win");
      return;
    }

    attackTimeout = setTimeout(enemyAttack, 800);
  };

  // 逃げるボタン
  document.getElementById("runBtn").onclick = function() {
    if (attackTimeout) clearTimeout(attackTimeout);
    window.endBattle("run");
  };
};
