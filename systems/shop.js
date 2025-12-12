// ショップシステム
window.openShop = function() {
  const shopItems = [
    { id: 1, price: 50 },
    { id: 2, price: 80 },
    { id: 3, price: 150 }
  ];

  let shopHTML = "<h3>アイテムショップ</h3>";
  shopItems.forEach(item => {
    const data = window.items.find(i => i.id === item.id);
    shopHTML += `
      <div class="shopItem">
        <b>${data.name}</b> - ${data.description}<br>
        価格: ${item.price}G 
        <button onclick="buyItem(${item.id}, ${item.price})">購入</button>
      </div><hr>
    `;
  });
  const box = document.createElement("div");
  box.id = "shopWindow";
  box.innerHTML = `
    <div class="shopContent">
      ${shopHTML}
      <button onclick="closeShop()">閉じる</button>
    </div>
  `;
  document.body.appendChild(box);
};

window.closeShop = function() {
  const box = document.getElementById("shopWindow");
  if (box) box.remove();

  // 💬 商人の「またのご利用をお待ちしております！」を出す
  if (window.activeNpc && window.activeNpc.name === "商人") {
    // ここで dialogue.js の機能を呼ぶ
    handleChoice("shop_cancel");
  }
};

window.buyItem = function(id, price) {
  if (playerStatus.gold >= price) {
    playerStatus.gold -= price;
    const existing = window.inventory.find(i => i.id === id);
    if (existing) existing.quantity++;
    else window.inventory.push({ id, quantity: 1 });
    alert("購入しました！");
    updateStatusWindow();
  } else {
    alert("お金が足りません！");
  }
};