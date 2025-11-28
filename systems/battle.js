// --- battle.js ---

// 戦闘開始
window.startBattle = function(enemyId) {
  // enemies 配列から敵を取得
  const enemyData = window.enemies.find(e => e.id === enemyId);
  if (!enemyData) return;

  // currentEnemy 用にコピーを作成（元の enemies 配列は破壊しない）
  const enemy = { ...enemyData };
  if (!enemy.hp) enemy.hp = 100; // デフォルトHP
  if (!enemy.maxHp) enemy.maxHp = enemy.hp;
  if (!enemy.attack) enemy.attack = 10; // デフォルト攻撃力

  // battleUI に敵情報を渡して戦闘画面表示
  battleUI.show(enemy);
};
