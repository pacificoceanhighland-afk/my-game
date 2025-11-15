// 選択肢ボックスを生成する関数
window.createChoiceBox = function() {
  if (!document.getElementById("choiceBox")) {
    const box = document.createElement("div");
    box.id = "choiceBox";
    box.style.position = "absolute";
    box.style.bottom = "50px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.background = "rgba(0,0,0,0.8)";
    box.style.padding = "10px";
    box.style.borderRadius = "8px";
    box.style.display = "none";
    document.body.appendChild(box);
  }
};

// 選択肢を表示する関数
window.showChoices = function(choices) {
  createChoiceBox(); // ボックスを作る（まだ作られていなければ）
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
// 選択肢クリック時の処理
// ======================================================
window.handleChoice = function(next) {
  document.getElementById("choiceBox").style.display = "none";

  if (next === "shop_open") {
    // 🟡 商人のセリフボックスを非表示にする
    document.getElementById("npcMessageBox").style.display = "none";
    document.getElementById("playerMessageBox").style.display = "none";
    document.getElementById("npcImage").style.display = "none";

    openShop(); // ショップを開く
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
