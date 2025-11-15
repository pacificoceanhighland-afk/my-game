window.draw = function(ctx, currentMap, playerX, playerY) {
  const tileSize = 32;

  // ===== 1) タイル描画 =====
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < currentMap.map.length; y++) {
    for (let x = 0; x < currentMap.map[y].length; x++) {
      const tile = currentMap.map[y][x];
      if (tile === 1) ctx.fillStyle = "#808080";
      else if (tile === 0) ctx.fillStyle = currentMap.floorColor;
      else if ([2,3,4,5,16,17,18,19,20,21,22,23,24,25,26,27].includes(tile)) ctx.fillStyle = "#800000";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // ===== 2) NPC描画（安全版） =====
  for (let npc of (window.npcs || [])) {
    // isActive が false のNPCは描かない
    if (npc.isActive === false) continue;

    // 同じマップにいるか判定（オブジェクトまたは名前で比較）
    const sameMap =
      npc.map === currentMap ||
      (npc.map && currentMap && npc.map.name && currentMap.name && npc.map.name === currentMap.name);

    if (sameMap) {
      ctx.fillStyle = npc.color || "#ffffff";
      ctx.fillRect(npc.x * tileSize, npc.y * tileSize, tileSize, tileSize);
    }
  }

  // ===== 3) 敵描画 =====
  if (currentMap.enemies) {
    for (let e of currentMap.enemies) {
      const enemyData = enemies.find(en => en.id === e.id);
      if (!enemyData || !enemyData.img) continue;
      ctx.drawImage(enemyData.img, e.x * tileSize, e.y * tileSize, tileSize, tileSize);
    }
  }

  // ===== 4) プレイヤー描画 =====
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(playerX * tileSize, playerY * tileSize, tileSize, tileSize);
};
