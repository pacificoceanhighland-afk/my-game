window.startBattle = function(enemyId) {
  // enemies 配列から敵を取得
  const enemy = window.enemies.find(e => e.id === enemyId);
  if (!enemy) return;

  console.log(`${enemy.name} が現れた！`);
  battleUI.show(enemy);
};
