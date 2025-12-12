// --- systems/dialogue.js 修正版 ---

// ======================================================
// グローバル変数
// ======================================================
window.activeNpc = null;
window.dialogueIndex = 0;

// ======================================================
// ★ 新規追加: 仲間をパーティに追加するアクション関数
// ======================================================
/**
 * 仲間データを直接受け取り、partySystemに追加します。（npcs.jsの形式に対応）
 * @param {object} memberData - 仲間として追加するステータス情報を含むオブジェクト
 */
window.addPartyMember = function(memberData) {
    if (!memberData || !memberData.name) {
        console.error("[PartySystem] 無効なメンバーデータが渡されました。");
        return;
    }

    // window.partySystem.add は party.js で定義済み
    if (window.partySystem && window.partySystem.add) {
        window.partySystem.add(memberData);
    } else {
        console.error("[PartySystem] window.partySystem.add が定義されていません。party.jsを読み込んでください。");
    }

    // 仲間にしたNPCをマップ上から非表示にする（npcs.jsのロジックを再現）
    const npc = window.npcs.find(n => n.name === memberData.name);
    if (npc) {
        npc.isActive = false;
        // マップの再描画（NPCをすぐに消すため）
        if (window.drawMap) window.drawMap(); 
        if (window.updatePlayer) window.updatePlayer();
    }
};

// ======================================================
// 会話開始
// ======================================================
window.startDialogue = function (npc) {
    window.activeNpc = npc;
    window.dialogueIndex = 0;

    const npcImage = document.getElementById("npcImage");
    if (npcImage && npc.image) {
        npcImage.src = npc.image;
        npcImage.style.transition = "none";
        npcImage.style.opacity = 1;
        npcImage.style.display = "block";
    }
    window.showDialogue();
};

// ======================================================
// 会話表示
// ======================================================
window.showDialogue = function () {
    if (!window.activeNpc) return;

    if (window.dialogueIndex >= window.activeNpc.dialogue.length) {
        // 会話終了時は立ち絵を消してリセット
        const npcImage = document.getElementById("npcImage");
        if (npcImage) npcImage.style.display = "none";

        // ★ エラー解消のため、window.を付けずに呼び出す（最下部で関数宣言に直すため）
        hideMessage(); 
        
        window.activeNpc = null;

        // 会話が終わっていればプレイヤー画像は表示しておく（通常表示に戻す）
        const p = document.getElementById("playerImage");
        if (p && window.playerStatus) p.style.display = "block";

        return;
    }

    const line = window.activeNpc.dialogue[window.dialogueIndex];

    // 一旦非表示リセット（吹き出し等）
    document.getElementById("npcMessageBox").style.display = "none";
    document.getElementById("playerMessageBox").style.display = "none";
    document.getElementById("choiceBox").style.display = "none";

    const npc = window.activeNpc;
    const npcImage = document.getElementById("npcImage");
    const playerImage = document.getElementById("playerImage");
    const stillLine = document.getElementById("npcStillLine");

    // ---------- 立ち絵表示判定 ----------
    // ※ここで一旦 npcImage を隠してから判定する（表示は必要なら復帰）
    npcImage.style.display = "none";
    let showStill = false;

    const currentSrc = (npcImage.src || "").split("/").pop();
    const stillSrc = (npc.image || "").split("/").pop();
    const standingSrc = (npc.standingImage || "").split("/").pop();

    if (npc.image && (currentSrc === stillSrc || currentSrc === standingSrc)) {
        showStill = true;
    }

    // ---------- 立ち絵の表示 / 位置調整 ----------
    if (showStill) {
        npcImage.style.display = "block";

        const isStanding = currentSrc === standingSrc;
        let currentSize = isStanding ? (npc.standingSize ?? npc.imageSize ?? 500) : (npc.imageSize ?? 500);
        let currentRight = isStanding ? (npc.standingRight ?? npc.imageRight ?? 0) : (npc.imageRight ?? 0);
        let currentBottom = isStanding ? (npc.standingBottom ?? npc.imageBottom ?? 0) : (npc.imageBottom ?? 0);

        npcImage.style.width = currentSize + "px";
        npcImage.style.maxHeight = "none";
        npcImage.style.right = currentRight + "px";
        npcImage.style.bottom = currentBottom + "px";

        document.getElementById("npcMessageBox").classList.add("shift-left");
        if (stillLine) stillLine.style.display = "block";

        // still が表示されているときだけ playerImage を非表示にする（ここがキー）
        if (playerImage) playerImage.style.display = "none";

} else { // showStill が false の場合
        document.getElementById("npcMessageBox").classList.remove("shift-left");
        if (stillLine) stillLine.style.display = "none";

        // still 出ていないならプレイヤー画像は通常表示に戻す（NPC会話時でも表示して良い）
        // ★★★ 修正: 以下のブロック全体をコメントアウトまたは削除します ★★★
        /*
        if (playerImage && window.playerStatus) {
            const pStatus = window.playerStatus;
            if (pStatus.setPlayerImage) {
                pStatus.setPlayerImage(pStatus.image, pStatus.imageSize, pStatus.imageLeft, pStatus.imageBottom);
            } else {
                playerImage.src = pStatus.image || "images/player.png";
                playerImage.style.width = (pStatus.imageSize || 600) + "px";
                playerImage.style.left = (pStatus.imageLeft || 0) + "px";
                playerImage.style.bottom = (pStatus.imageBottom || 0) + "px";
            }
            playerImage.style.display = "block";
        }
        */
    }

    // ---------- 台詞表示 ----------
    if (line.speaker === "npc") {
        // NPCが話すとき：playerImage は上の showStill 判定に従う（ここでは消さない）
        document.getElementById("npcNameBox").textContent = npc.name;
        document.getElementById("npcNameBox").style.color = npc.nameColor || "#ffffff";
        document.getElementById("npcMessageText").textContent = line.text;
        document.getElementById("npcMessageBox").style.display = "block";

        document.getElementById("playerMessageBox").classList.remove("shift-right");

    } else if (line.speaker === "player") {
        // Player が話すとき：吹き出しを表示、playerImage は showStill に従う（上で既に処理）
        document.getElementById("npcMessageBox").classList.remove("shift-left");
        document.getElementById("playerMessageBox").classList.add("shift-right");

        document.getElementById("playerNameBox").textContent = window.playerStatus.name || "〈赤の王〉";
        document.getElementById("playerNameBox").style.color = "#ff5555";
        document.getElementById("playerMessageText").textContent = line.text;
        document.getElementById("playerMessageBox").style.display = "block";
    }

    // アクション・選択肢処理
    if (line.action) line.action();
    if (line.choices) {
        showChoices(line.choices);
        return;
    }
};

// ======================================================
// スチル→立ち絵切り替え
// ======================================================
window.switchToStanding = function () {
    const npcImage = document.getElementById("npcImage");
    const npc = window.activeNpc;
    if (!npc || !npc.standingImage) return;

    const currentSrc = npcImage.src.split("/").pop();
    const standingSrc = (npc.standingImage || "").split("/").pop();
    if (currentSrc === standingSrc) return;

    npcImage.style.transition = "opacity 0.1s";
    npcImage.style.opacity = 0;

    setTimeout(() => {
        npcImage.src = npc.standingImage;
        npcImage.style.display = "block";
        npcImage.style.width = (npc.standingSize ?? npc.imageSize) + "px";
        npcImage.style.maxHeight = "none";
        npcImage.style.right = (npc.standingRight ?? npc.imageRight) + "px";
        npcImage.style.bottom = (npc.standingBottom ?? npc.imageBottom) + "px";

        npcImage.style.transition = "opacity 0.4s";
        npcImage.style.opacity = 1;
    }, 50);
};

// ======================================================
// 選択肢表示
// ======================================================
window.showChoices = function (choices) {
    const box = document.getElementById("choiceBox");
    box.innerHTML = "";
    choices.forEach((c) => {
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
window.handleChoice = function (next) {
    document.getElementById("choiceBox").style.display = "none";

    if (next === "shop_open") {
        hideMessage(); // ★ window.を外して呼び出し
        openShop();
        return;
    }

    if (next === "shop_cancel") {
        const npc = window.activeNpc;
        const nextLine = npc.dialogue.find((line) => line.next === "shop_cancel");

        if (nextLine) {
            document.getElementById("npcMessageBox").style.display = "block";
            document.getElementById("npcMessageText").textContent = nextLine.text;
            document.getElementById("npcNameBox").textContent = npc.name;
            document.getElementById("npcNameBox").style.color = npc.nameColor || "#ffffff";

            setTimeout(() => {
                hideMessage(); // ★ window.を外して呼び出し
                window.activeNpc = null;

                // 🌟 ここでも会話終了後なので playerImage 復活
                const p = document.getElementById("playerImage");
                if (window.playerStatus) p.style.display = "block";

            }, 1500);
            return;
        }
    }

    window.dialogueIndex++;
    window.showDialogue();
};

// ======================================================
// 次のセリフ
// ======================================================
window.nextDialogue = function () {
    if (window.activeNpc) {
        window.dialogueIndex++;
        window.showDialogue();
    }
};

// ======================================================
// 会話を非表示
// ======================================================
// ★ 修正: 関数宣言 (function) を使用し、巻き上げ(hoisting)により呼び出し順序の問題を解消する
function hideMessage() {
    document.getElementById("npcMessageBox").style.display = "none";
    document.getElementById("playerMessageBox").style.display = "none";
    document.getElementById("npcImage").style.display = "none";
    document.getElementById("choiceBox").style.display = "none";

    document.getElementById("npcMessageBox").classList.remove("shift-left");
    document.getElementById("playerMessageBox").classList.remove("shift-right");

    const stillLine = document.getElementById("npcStillLine");
    if (stillLine) stillLine.style.display = "none";
}
// グローバル変数としても使えるよう代入
window.hideMessage = hideMessage;


// ======================================================
// player メッセージ（外部呼び出し用）
// ======================================================
function showPlayerMessage(text, playerName = "プレイヤー") {
    const box = document.getElementById("playerMessageBox");
    document.getElementById("playerNameBox").textContent = playerName;
    document.getElementById("playerMessageText").textContent = text;
    box.style.display = "block";
}
window.showPlayerMessage = showPlayerMessage; // グローバル化

function hidePlayerMessage() {
    document.getElementById("playerMessageBox").style.display = "none";
}
window.hidePlayerMessage = hidePlayerMessage; // グローバル化