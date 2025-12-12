window.setupInput = function () {
  document.addEventListener("keydown", (e) => {
    // --- 1. 戦闘中のスキル入力 (変更なし) ---
    if (battleUI.currentEnemy) {
      // ... (戦闘中の処理) ...
      
      // スキル使用のキー入力処理
      if (e.key === "1" && playerStatus.skills && playerStatus.skills[0]) {
        const skill = window.skills[playerStatus.skills[0]];
        if (skill) battleUI.useSkill(skill);
      }
      if (e.key === "2" && playerStatus.skills && playerStatus.skills[1]) {
        const skill = window.skills[playerStatus.skills[1]];
        if (skill) battleUI.useSkill(skill);
      }
      return; // 戦闘中は移動や会話を無効化
    }
    
    // --- 2. 会話中の入力 (変更なし) ---
    if (activeNpc) {
      // ... (会話中の処理) ...
      
      if (e.key === " ") {
        window.dialogueIndex++;
        window.showDialogue();

        const line = activeNpc.dialogue[window.dialogueIndex];
        if (line && line.action) line.action();
      }
      return; // 会話中は他の入力を無効化
    }

    let nextX = playerX;
    let nextY = playerY;

    // --- 移動方向 (変更なし) ---
    if (e.key === "ArrowUp") nextY--;
    if (e.key === "ArrowDown") nextY++;
    if (e.key === "ArrowLeft") nextX--;
    if (e.key === "ArrowRight") nextX++;

    // --- 範囲チェック (変更なし) ---
    if (
      nextY >= 0 &&
      nextY < currentMap.map.length &&
      nextX >= 0 &&
      nextX < currentMap.map[nextY].length
    ) {
      const tile = currentMap.map[nextY][nextX];

      // 壁(1)でなければ移動を試行
      if (tile !== 1) {
        
        // --- 敵接触判定 【★ ここを修正します】 ---
        // checkEnemyCollision は敵の配列インデックス (0, 1, 2...) を返す
        const enemyIndex = checkEnemyCollision(nextX, nextY, currentMap); 
        
        // 敵に接触した場合
        if (enemyIndex !== null) {
          console.log("[BATTLE START]", enemyIndex);
          
          // ★ startBattle 関数に、敵の「インデックス」と「現在のマップ情報」を渡す
          // startBattle(enemy) の代わりにこれに置き換えます
          window.startBattle(enemyIndex, currentMap); 

          return; // 座標を確定させずにここで処理を終了
        }

        // 敵も壁もいなければ、座標を確定
        playerX = nextX;
        playerY = nextY;

        // ... (マップ遷移チェックなど、その他の処理は変更なし) ...
        const movedTile = currentMap.map[playerY][playerX];

        for (let t of window.mapTransitions) {
          if (
            currentMap.name === t.from.name &&
            movedTile === t.tile
          ) {
            currentMap = t.to;
            playerX = t.spawnX;
            playerY = t.spawnY;

            if (window.drawMap) drawMap();
            if (window.updatePlayer) updatePlayer();

            return;
          }
        }
      }
    }

    // --- スペースキーで会話開始 (変更なし) ---
    if (e.key === " ") {
      // ... (会話開始の処理) ...
      
      if (!activeNpc) { 
        for (let npc of window.npcs) {
          if (
            npc.isActive !== false &&
            currentMap.name === npc.map &&
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