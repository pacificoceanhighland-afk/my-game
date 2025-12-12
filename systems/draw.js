window.draw = function(ctx, currentMap, playerX, playerY) {
  const tileSize = 32;

  // ======================================================
  // ★ 修正: currentMap が null でないかチェックし、null なら描画を中断
  // ======================================================
  if (!currentMap) {
    console.warn("描画エラー: currentMap が null です。マップの初期化または読み込み順序を確認してください。");
    // null の場合は画面をクリアするだけで終了
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // ===== 1) タイル描画 (修正なし) =====
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // エラーが発生していた行: currentMap.map.length に安全にアクセス可能になる
  for (let y = 0; y < currentMap.map.length; y++) {
    for (let x = 0; x < currentMap.map[y].length; x++) {
      const tile = currentMap.map[y][x];
      if (tile === 1) ctx.fillStyle = "#808080";
      else if (tile === 0) ctx.fillStyle = currentMap.floorColor;
      else if ([2,3,4,5,16,17,18,19,20,21,22,23,24,25,26,27,28,29].includes(tile)) ctx.fillStyle = "#800000";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // ===== 2) NPC描画 (変更なし) =====
  for (let npc of (window.npcs || [])) {
    if (npc.isActive === false) continue;
    
    // npc.map (文字列) と currentMap.name (文字列) で比較
    const sameMap = (npc.map === currentMap.name);
    
    if (sameMap) {
      ctx.fillStyle = npc.color || "#ffffff";
      ctx.fillRect(npc.x * tileSize, npc.y * tileSize, tileSize, tileSize);
    }
  }

  // ======================================================
  // 3) 敵描画 (変更なし)
  // ======================================================
  if (currentMap.enemies) {
    const enemyImageCache = window.enemyImages || {}; 
    
    for (let e of currentMap.enemies) {
      const imgObject = e.id !== undefined ? enemyImageCache[e.id] : null;
      
      if (imgObject && imgObject.complete) {
        ctx.drawImage(imgObject, e.x * tileSize, e.y * tileSize, tileSize, tileSize);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(e.x * tileSize, e.y * tileSize, tileSize, tileSize);
      }
    }
  }

  // ===== 4) プレイヤー描画 (変更なし) =====
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(playerX * tileSize, playerY * tileSize, tileSize, tileSize);
};