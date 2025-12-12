window.checkEnemyCollision = function(x, y, map) {
  if (!map.enemies) return null;

  // インデックスも同時に取得するため、for...of ではなく 標準の for ループを使う
  for (let i = 0; i < map.enemies.length; i++) {
    const e = map.enemies[i];
    
    if (e.x === x && e.y === y) {
      // 接触した敵の「インデックス (i)」を返すように変更する！
      return i; 
    }
  }

  return null;
};