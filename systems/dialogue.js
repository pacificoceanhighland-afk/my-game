// ======================================================
// グローバル変数
// ======================================================
window.activeNpc = null;
window.dialogueIndex = 0;

// ======================================================
// 会話開始
// ======================================================
window.startDialogue = function(npc) {
  window.activeNpc = npc;
  window.dialogueIndex = 0;
  window.showDialogue();
};

// ======================================================
// 会話表示
// ======================================================
window.showDialogue = function() {
  if (!window.activeNpc) return;

  if (window.dialogueIndex >= window.activeNpc.dialogue.length) {
    window.hideMessage();
    window.activeNpc = null;

    // 会話終了後、全てリセット（プレイヤー立ち絵を戻す）
    const playerImage = document.getElementById("playerImage");
    const npcImage = document.getElementById("npcImage");
    playerImage.style.display = "block";
    npcImage.style.display = "none";
    return;
  }

  const line = window.activeNpc.dialogue[window.dialogueIndex];

  // 一旦非表示リセット
  document.getElementById("npcMessageBox").style.display = "none";
  document.getElementById("playerMessageBox").style.display = "none";
  document.getElementById("choiceBox").style.display = "none";

  const npc = window.activeNpc;
  const npcImage = document.getElementById("npcImage");
  const playerImage = document.getElementById("playerImage");

// --- 白の神官女だけ特殊処理 ---
if (window.activeNpc.name === "〈白の神官女〉") {
  const isStanding = npcImage.src.includes(window.activeNpc.standingImage);

  // すでに立ち絵状態なら、再設定しない（ちらつき防止）
  if (isStanding) {
    // 何もしない
  } else {
    // 立ち絵に切り替え済みでなければ、スチルを表示
    npcImage.src = window.activeNpc.image;
    npcImage.style.display = "block";

    if (window.activeNpc.imageSize) npcImage.style.maxHeight = window.activeNpc.imageSize + "px";
    if (window.activeNpc.imageRight !== undefined) npcImage.style.right = window.activeNpc.imageRight + "px";
    if (window.activeNpc.imageBottom !== undefined) npcImage.style.bottom = window.activeNpc.imageBottom + "px";

    playerImage.style.display = "none";
  }
}
  else {
    // 通常NPC：プレイヤーもNPCも表示
    playerImage.style.display = "block";
    
    if (npc.image) {
      npcImage.src = npc.image;
      npcImage.style.display = "block";
      npcImage.style.maxHeight = npc.imageSize + "px";
      npcImage.style.right = npc.imageRight + "px";
      npcImage.style.bottom = npc.imageBottom + "px";
    } else {
      npcImage.style.display = "none";
    }
  }

  // --- 台詞表示 ---
  if (line.speaker === "npc") {
    document.getElementById("npcNameBox").textContent = npc.name;
    document.getElementById("npcNameBox").style.color = npc.nameColor || "#ffffff";
    document.getElementById("npcMessageText").textContent = line.text;
    document.getElementById("npcMessageBox").style.display = "block";
  } else if (line.speaker === "player") {
    document.getElementById("playerNameBox").textContent = window.playerStatus.name || "〈赤の王〉";
    document.getElementById("playerNameBox").style.color = "#ff5555";
    document.getElementById("playerMessageText").textContent = line.text;
    document.getElementById("playerMessageBox").style.display = "block";
  }

  // --- アクション実行 ---
  if (line.action) line.action();

  if (line.choices) {
    showChoices(line.choices);
    return;
  }
};

// ======================================================
// スチル→立ち絵切り替え処理（ちらつき防止版）
// ======================================================
window.switchToStanding = function() {
  const npcImage = document.getElementById("npcImage");
  const playerImage = document.getElementById("playerImage");
  const npc = window.activeNpc;
  if (!npc) return;

  // 🔹 すでに立ち絵画像が表示されていたら何もしない
  const currentSrc = npcImage.src.split("/").pop(); // ファイル名だけ抜く
  const standingSrc = (npc.standingImage || "").split("/").pop();
  if (currentSrc === standingSrc) return; // ←これで再切り替え防止！

  // 🔹 フェードアウトして切り替え
  npcImage.style.transition = "opacity 0.4s";
  npcImage.style.opacity = 0;

  setTimeout(() => {
    // スチルを再表示せず、直接立ち絵へ切り替え
    npcImage.src = npc.standingImage || npc.image;
    npcImage.style.display = "block";
    npcImage.style.opacity = 1;

// 立ち絵用サイズ・位置（自由サイズ）
npcImage.style.maxHeight = (npc.standingSize ?? npc.imageSize) + "px";
npcImage.style.right = (npc.standingRight ?? npc.imageRight) + "px";
npcImage.style.bottom = (npc.standingBottom ?? npc.imageBottom) + "px";

    // プレイヤー立ち絵も表示（あれば）
    playerImage.src = "images/player.png";
    playerImage.style.display = "block";
  }, 200);
};

// ======================================================
// 選択肢表示
// ======================================================
window.showChoices = function(choices) {
  const box = document.getElementById("choiceBox");
  box.innerHTML = "";
  choices.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c.text;
    btn.onclick = () => handleChoice(c.next);
    box.appendChild(btn);
  });
  box.style.display = "block";
};

// ======================================================
// 選択肢クリック
// ======================================================
window.handleChoice = function(next) {
  document.getElementById("choiceBox").style.display = "none";

  if (next === "shop_open") {
    window.hideMessage();
    openShop();
    return;
  }

  if (next === "shop_cancel") {
    const npc = window.activeNpc;
    if (npc && npc.dialogue) {
      const nextLine = npc.dialogue.find(line => line.next === "shop_cancel");
      if (nextLine) {
        document.getElementById("npcMessageBox").style.display = "block";
        document.getElementById("npcMessageText").textContent = nextLine.text;
        document.getElementById("npcNameBox").textContent = npc.name;
        document.getElementById("npcNameBox").style.color = npc.color;

        setTimeout(() => {
          window.hideMessage();
          window.activeNpc = null;
        }, 1500);
        return;
      }
    }
  }

  window.dialogueIndex++;
  window.showDialogue();
};

// ======================================================
// 次のセリフに進む
// ======================================================
window.nextDialogue = function() {
  if (window.activeNpc) {
    window.dialogueIndex++;
    window.showDialogue();
  }
};

// ======================================================
// 会話を非表示
// ======================================================
window.hideMessage = function() {
  document.getElementById("npcMessageBox").style.display = "none";
  document.getElementById("playerMessageBox").style.display = "none";
  document.getElementById("npcImage").style.display = "none";
  document.getElementById("choiceBox").style.display = "none";
};
