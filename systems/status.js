// ================================================
// ステータスウィンドウ管理（改良版）
// ================================================

// ステータス表示更新
window.updateStatusWindow = function () {
  const s = window.playerStatus;
  const el = document.getElementById("statusWindow");
  if (!el || !s) return;

  // 装備名
  const weaponName = s.weapon?.name ?? "なし";
  const armorName  = s.armor?.name  ?? "なし";

  el.innerHTML = `
    <b>${s.name}</b><br>
    Lv: ${s.level}<br>
    HP: ${s.hp} / ${s.maxHp}<br>
    MP: ${s.mp} / ${s.maxMp}<br>
    攻撃: ${s.attack}<br>
    防御: ${s.defense}<br>
    経験値: ${s.exp} / ${s.nextExp}<br>
    所持金: ${s.gold} G<br>
    <hr style="border: 1px solid #555;">
    武器: ${weaponName}<br>
    防具: ${armorName}
  `;
};

// ステータスウィンドウの状態
window.isStatusVisible = true;

// 開閉トグル
window.toggleStatusWindow = function () {
  const statusEl = document.getElementById("statusWindow");
  if (!statusEl) return;

  window.isStatusVisible = !window.isStatusVisible;

  if (window.isStatusVisible) {
    statusEl.classList.remove("hidden");
  } else {
    statusEl.classList.add("hidden");
  }
};

// Sキーでステータス開閉
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "s") {
    window.toggleStatusWindow();
  }
});
