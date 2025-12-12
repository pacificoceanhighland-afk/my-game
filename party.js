// --- party.js（完全修正版：EXP判定バグ修正 + deepCopy対応） ---

// ======================================================
// 共通レベルアップ機能のファクトリ関数（グローバル）
// ======================================================
window.createLevelUpMethods = function () {
    return {
        calculateNextExp() {
            return this.level * 100;
        },

        gainExp(expAmount) {
            console.log(`${this.name} は経験値 ${expAmount} を獲得した！`);
            if (expAmount <= 0) return;

            this.exp += expAmount;

            while (this.exp >= this.calculateNextExp()) {
                this.exp -= this.calculateNextExp();
                this.levelUp();
            }
        },

        levelUp() {
            this.level++;
            this.maxHp += 8;
            this.hp = this.maxHp;
            this.maxMp += 3;
            this.mp = this.maxMp;
            this.attack += 1;
            this.defense += 1;

            console.log(`🎉 ${this.name} はレベル ${this.level} にアップした！`);
        }
    };
};


// ======================================================
// パーティシステム
// ======================================================
window.party = window.party || [];

// ★ 深いコピー（仲間生成の安全性向上）
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

window.partySystem = {
    get party() {
        return window.party;
    },

    initUI() {
        if (document.getElementById("partyBox")) return;

        const partyBox = document.createElement("div");
        partyBox.id = "partyBox";
        Object.assign(partyBox.style, {
            position: "fixed", top: "10px", right: "10px",
            background: "rgba(0,0,0,0.6)", color: "white",
            padding: "6px 12px", borderRadius: "8px",
            fontSize: "14px", zIndex: 99999
        });
        partyBox.textContent = "仲間：なし";
        document.body.appendChild(partyBox);

        const statusBox = document.createElement("div");
        statusBox.id = "partyStatusBox";
        Object.assign(statusBox.style, {
            position: "fixed", top: "50px", right: "10px",
            background: "rgba(0,0,0,0.8)", color: "white",
            padding: "10px", borderRadius: "10px", display: "none",
            fontSize: "14px", zIndex: 99999
        });
        document.body.appendChild(statusBox);

        const msgBox = document.createElement("div");
        msgBox.id = "systemMessage";
        Object.assign(msgBox.style, {
            position: "absolute", bottom: "60px", left: "50%",
            transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)",
            color: "black", padding: "10px 20px", borderRadius: "10px",
            display: "none", fontWeight: "bold", fontSize: "18px",
            zIndex: 99999
        });
        document.body.appendChild(msgBox);

        partyBox.addEventListener("click", () => {
            statusBox.style.display =
                (statusBox.style.display === "none" || statusBox.style.display === "")
                    ? "block" : "none";
            if (statusBox.style.display === "block") {
                this.showPartyStatus();
            }
        });

        this.updatePartyDisplay();
    },

    add(member) {
        if (!member || !member.name) return;
        if (!this.party.some(m => m.name === member.name)) {
            this.party.push(member);
            this.showJoinedMessage(member.name);
            this.updatePartyDisplay();
        }
    },

    updatePartyDisplay() {
        const el = document.getElementById("partyBox");
        if (!el) return;

        el.textContent =
            this.party.length === 0
                ? "仲間：なし"
                : "仲間：" + this.party.map(m => m.name).join("、");
    },

    showPartyStatus() {
        const box = document.getElementById("partyStatusBox");
        if (!box) return;

        const members = [window.playerStatus].concat(this.party);

        box.innerHTML = "";
        members.forEach(member => {
            box.innerHTML += `
                <div style="margin-bottom:8px">
                  <strong>${member.name}${member === window.playerStatus ? "（主人公）" : ""}</strong><br>
                  Lv：${member.level}<br>
                  HP：${member.hp}/${member.maxHp}<br>
                  MP：${member.mp}/${member.maxMp}<br>
                  攻撃：${member.attack}　
                  防御：${member.defense}<br>
                  EXP：${member.exp} / ${member.calculateNextExp()}<br>
                  ${member.weapon ? `装備：${member.weapon}` : ""}
                  <hr style="border:0; border-top:1px solid rgba(255,255,255,0.2)">
                </div>
            `;
        });
    },

    showJoinedMessage(name) {
        const msg = document.getElementById("systemMessage");
        if (!msg) return;

        msg.textContent = `${name}が仲間になった！`;
        msg.style.display = "block";
        setTimeout(() => (msg.style.display = "none"), 1800);
    },

    // ======================================================
    // ★ 経験値分配（バグ修正版：before/after のレベル比較）
    // ======================================================
    distributeExp(expAmount) {
        if (expAmount <= 0) return;

        const members = [window.playerStatus].concat(this.party);
        const living = members.filter(m => m.hp > 0 && typeof m.gainExp === "function");

        if (living.length === 0) return;

        const expPerMember = Math.floor(expAmount / living.length);
        if (expPerMember <= 0) return;

        console.log(`獲得経験値 ${expAmount} → 生存 ${living.length}名 → ${expPerMember} EXP配分`);

        let levelUpOccurred = false;

        living.forEach(member => {
            const before = member.level;
            member.gainExp(expPerMember);
            if (member.level > before) levelUpOccurred = true;
        });

        if (levelUpOccurred) {
            this.updatePartyDisplay();
            this.showPartyStatus();
        }
    }
};


// ======================================================
// 仲間データ
// ======================================================
const defaultStats = {
    level: 1,
    hp: 80,
    maxHp: 80,
    mp: 20,
    maxMp: 20,
    attack: 15,
    defense: 10,
    exp: 0,
    img: "images/npc_default.png"
};

const companionLevelUpMethods = window.createLevelUpMethods();

window.companionData = {
    alexandria: {
        ...deepCopy(defaultStats),
        ...companionLevelUpMethods,
        name: "アレキサンドリア",
        hp: 90,
        maxHp: 90,
        attack: 25,
        weapon: "細身の剣",
        skills: ["doubleStrike"],
        img: "images/alexandria.png"
    },

    shrineMaiden: {
        ...deepCopy(defaultStats),
        ...companionLevelUpMethods,
        name: "〈白の神官女〉",
        mp: 40,
        maxMp: 40,
        defense: 12,
        attack: 8,
        weapon: "杖",
        skills: ["healingLight", "purify"],
        buffs: [],
        img: "images/shrine_maiden.png"
    }
};


// ======================================================
window.addEventListener("DOMContentLoaded", () => {
    window.partySystem.initUI();
});
