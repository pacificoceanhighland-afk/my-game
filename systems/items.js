// アイテムウィンドウを更新して表示
function updateItemWindow() {
  const el = document.getElementById("itemWindow");
  el.innerHTML = "<h3>🎒 アイテム</h3>";
  
  if (inventory.length === 0) {
    el.innerHTML += "<p>何も持っていない</p>";
    return;
  }

  inventory.forEach((invItem, index) => {
    const item = items.find(i => i.id === invItem.id);
    el.innerHTML += `
      <div class="item-entry" data-index="${index}">
        ${item.name} ×${invItem.quantity}<br>
        <small>${item.description}</small>
      </div>
    `;
  });
}

// アイテムを使用
function useItem(index) {
  const invItem = inventory[index];
  const item = items.find(i => i.id === invItem.id);
  if (!item) return;

  switch (item.type) {
    case "heal":
      playerStatus.hp = Math.min(playerStatus.maxHp, playerStatus.hp + item.healAmount);
      break;
    case "mp":
      playerStatus.mp = Math.min(playerStatus.maxMp, playerStatus.mp + item.healAmount);
      break;
    case "full":
      playerStatus.hp = playerStatus.maxHp;
      playerStatus.mp = playerStatus.maxMp;
      break;
    case "weapon":
      // 装備切り替え
      if (playerStatus.weapon?.id === item.id) {
        alert(`${item.name}を外した。`);
        playerStatus.attack -= item.attack;
        playerStatus.weapon = null;
      } else {
        // 装備していたものを外す
        if (playerStatus.weapon) playerStatus.attack -= playerStatus.weapon.attack;
        playerStatus.weapon = item;
        playerStatus.attack += item.attack;
        alert(`${item.name}を装備した！`);
      }
      break;
    case "armor":
      if (playerStatus.armor?.id === item.id) {
        alert(`${item.name}を外した。`);
        playerStatus.defense -= item.defense;
        playerStatus.armor = null;
      } else {
        if (playerStatus.armor) playerStatus.defense -= playerStatus.armor.defense;
        playerStatus.armor = item;
        playerStatus.defense += item.defense;
        alert(`${item.name}を装備した！`);
      }
      break;
  }

  // 消費アイテムのみ減らす
  if (["heal", "mp", "full"].includes(item.type)) {
    invItem.quantity--;
    if (invItem.quantity <= 0) inventory.splice(index, 1);
  }
 
  updateStatusWindow();
  updateItemWindow();
}

// アイテムウィンドウ開閉
let isItemVisible = false;
function toggleItemWindow() {
  const el = document.getElementById("itemWindow");
  isItemVisible = !isItemVisible;
  el.classList.toggle("hidden", !isItemVisible);
  if (isItemVisible) updateItemWindow();
}

// クリックで使用
document.addEventListener("click", (e) => {
  if (e.target.closest(".item-entry")) {
    const index = e.target.closest(".item-entry").dataset.index;
    useItem(index);
  }
});

// 「I」キーで開閉
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "i") {
    toggleItemWindow();
  }
});
