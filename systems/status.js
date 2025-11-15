function updateStatusWindow() {
  const s = playerStatus;
  const el = document.getElementById("statusWindow");

  // 装備名がない場合の表示を設定
  const weaponName = s.weapon ? s.weapon.name : "なし";
  const armorName  = s.armor  ? s.armor.name  : "なし";

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
}

// ステータス開閉用フラグ
let isStatusVisible = true;

function toggleStatusWindow() {
  const statusEl = document.getElementById("statusWindow");
  isStatusVisible = !isStatusVisible;
  if (isStatusVisible) {
    statusEl.classList.remove("hidden");
  } else {
    statusEl.classList.add("hidden");
  }
}

// キーボード操作で開閉（Sキー）
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "s") {
    toggleStatusWindow();
  }
});
