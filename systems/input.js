window.setupInput = function() {
  document.addEventListener("keydown", (e) => {
    let nextX = playerX;
    let nextY = playerY;

    if (e.key === "ArrowUp") nextY--;
    if (e.key === "ArrowDown") nextY++;
    if (e.key === "ArrowLeft") nextX--;
    if (e.key === "ArrowRight") nextX++;

    // --- 範囲チェック ---
    if (
      nextY >= 0 &&
      nextY < currentMap.map.length &&
      nextX >= 0 &&
      nextX < currentMap.map[nextY].length
    ) {
      let tile = currentMap.map[nextY][nextX];

      // 壁でなければ移動
      if (tile !== 1) {
        playerX = nextX;
        playerY = nextY;

        // 敵接触判定（移動直後）
        const enemy = checkEnemyCollision(playerX, playerY, currentMap);
        if (enemy) {
          console.log("[BATTLE START]", enemy);
          startBattle(enemy);
          return; // 戦闘開始時は他の処理を止める
        }
      }

      // --- マップ遷移チェック ---
      for (let t of mapTransitions) {
        if (currentMap.name === t.from.name && tile === t.tile) {
          currentMap = t.to;
          playerX = t.spawnX;
          playerY = t.spawnY;
          break;
        }
      }
    }

    // --- スペースキーで会話 ---
    if (e.key === " ") {
      if (activeNpc) {
        dialogueIndex++;
        showDialogue();
      } else {
        for (let npc of npcs) {
          if (
            currentMap.name === npc.map.name &&
            Math.abs(playerX - npc.x) + Math.abs(playerY - npc.y) === 1
          ) {
            startDialogue(npc);
            return;
          }
        }
      }
    }
  });
};
