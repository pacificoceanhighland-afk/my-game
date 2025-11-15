// ======================================================
// パーティシステム管理（修正版）
// ======================================================

window.party = []; // 仲間オブジェクト配列

window.addEventListener("load", () => {
  // 仲間リスト表示ボックス（右上）
  const partyBox = document.createElement("div");
  partyBox.id = "partyBox";
  Object.assign(partyBox.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "sans-serif",
    zIndex: 99999,
    cursor: "pointer",
    pointerEvents: "auto" // クリックできるように
  });
  partyBox.textContent = "仲間：なし";
  document.body.appendChild(partyBox);

  // ステータスウィンドウ（クリックで開く）
  const statusBox = document.createElement("div");
  statusBox.id = "partyStatusBox";
  Object.assign(statusBox.style, {
    position: "absolute",
    top: "50px",
    right: "10px",
    background: "rgba(0,0,0,0.8)",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    display: "none",
    fontSize: "14px",
    zIndex: 99999
  });
  document.body.appendChild(statusBox);

  // 仲間加入メッセージボックス
  const msgBox = document.createElement("div");
  msgBox.id = "systemMessage";
  Object.assign(msgBox.style, {
    position: "absolute",
    bottom: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.95)",
    color: "black",
    padding: "10px 20px",
    borderRadius: "10px",
    display: "none",
    fontWeight: "bold",
    fontSize: "18px",
    zIndex: 99999
  });
  document.body.appendChild(msgBox);

  // 右上の仲間表示をクリックで詳細表示/非表示
  partyBox.addEventListener("click", () => {
    if (statusBox.style.display === "none" || statusBox.style.display === "") {
      showPartyStatus();
      statusBox.style.display = "block";
    } else {
      statusBox.style.display = "none";
    }
  });

  // 初期表示更新
  updatePartyDisplay();
});

// 仲間を追加する（オブジェクトを渡す）
window.addPartyMember = function(member) {
  if (!member || !member.name) return;
  const exists = window.party.some(m => m.name === member.name);
  if (!exists) {
    window.party.push(member);
    showPartyJoinedMessage(member.name);
    updatePartyDisplay();
  }
};

// 右上の仲間表示を更新
window.updatePartyDisplay = function() {
  const el = document.getElementById("partyBox");
  if (!el) return;
  if (window.party.length === 0) {
    el.textContent = "仲間：なし";
  } else {
    el.textContent = "仲間：" + window.party.map(m => m.name).join("、");
  }
};

// 加入メッセージ表示
function showPartyJoinedMessage(name) {
  const msgBox = document.getElementById("systemMessage");
  if (!msgBox) return;
  msgBox.textContent = `${name}が仲間になった！`;
  msgBox.style.display = "block";
  setTimeout(() => {
    msgBox.style.display = "none";
  }, 1800);
}

// 仲間ステータスを表示（クリックで表示される中身）
function showPartyStatus() {
  const box = document.getElementById("partyStatusBox");
  if (!box) return;

  if (window.party.length === 0) {
    box.innerHTML = "仲間はいません。";
    return;
  }

  box.innerHTML = ""; // リセット
  window.party.forEach(member => {
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <strong>${member.name}</strong><br>
      Lv：${member.level ?? 1}　HP：${member.hp ?? 0}/${member.maxHp ?? member.hp ?? 0}<br>
      攻撃：${member.attack ?? 0}　防御：${member.defense ?? 0}<br>
      ${member.weapon ? `装備：${member.weapon}` : ''}
      <hr style="border:0; border-top:1px solid rgba(255,255,255,0.2)">
    `;
    box.appendChild(div);
  });
}
