// --- systems/battleUI.js (修正版: ターゲット選択 + バフ表示の安定版) ---

window.battleUI = {
  container: null,
  currentEnemy: null,
  partyMembers: [],
  selectedMemberIndex: null,
  skillWindow: null,
  itemWindow: null,
  commandButtons: [],

  // ターゲット選択用
  targetingMode: false,
  currentAction: null, // { type: 'attack'|'skill'|'item', data: {...} }
  enemyTargetArea: null,
  targetWindow: null,
  cancelTargetBtn: null,

  init() {
    // コンテナ作成
    this.container = document.createElement("div");
    this.container.id = "battleScreen";
    Object.assign(this.container.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      display: "none",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px",
      zIndex: "1000"
    });

    // HTML をセット
    this.container.innerHTML = `
      <div id="enemyArea" style="display:flex; flex-direction:column; align-items:center; gap:5px; margin-top:10px; position:relative;">
        <img id="battleEnemyImage" src="" alt="敵" width="400" height="400" style="pointer-events:none;">
        <div id="battleEnemyName" style="font-weight:bold; margin-top:4px;"></div>
        <div id="enemyHpBar" style="width:200px; height:20px; background:#555; margin-top:5px;">
          <div id="enemyHpFill" style="height:100%; background:#f00; width:100%;"></div>
        </div>
        <div id="enemyTarget" style="position:absolute; top:0; left:0; width:100%; height:100%;"></div>
      </div>

      <div id="partyArea" style="display:flex; gap:10px; margin-top:12px;"></div>

      <div id="playerArea" style="margin-top:8px;">
        <div id="battlePlayerStatus"></div>
        <div id="playerBars" style="display:flex; gap: 10px; margin-top:5px;"> 
            <div id="playerHpContainer" style="width:100px;">
                <div id="playerHpText" style="font-size:12px; color:#0f0;"></div> 
                <div id="playerHpBar" style="width:100%; height:10px; background:#555;">
                    <div id="playerHpFill" style="height:100%; background:#0f0; width:100%;"></div>
                </div>
            </div>
            <div id="playerMpContainer" style="width:100px;">
                <div id="playerMpText" style="font-size:12px; color:#00f;"></div> 
                <div id="playerMpBar" style="width:100%; height:10px; background:#555;">
                    <div id="playerMpFill" style="height:100%; background:#00f; width:100%;"></div>
                </div>
            </div>
        </div>
      </div>

      <div id="battleCommands" style="margin-top:12px;">
        <button id="attackButton">攻撃</button>
        <button id="skillButton">スキル</button>
        <button id="itemButton">アイテム</button>
        <button id="runButton">逃げる</button>
      </div>

      <div id="battleLog" style="width:90%; min-height:60px; margin-top:10px; color:#fff;"></div>

      <div id="targetWindow" style="position:absolute; bottom:20px; padding:10px; background:rgba(0,0,0,0.9); border:1px solid white; border-radius:8px; display:none; z-index:2000;">
          <div>ターゲットを選択してください。</div>
          <button id="cancelTargetButton" style="margin-left:10px; margin-top:5px;">キャンセル</button>
      </div>
    `;

    // ボタン参照
    this.attackBtn = this.container.querySelector("#attackButton");
    this.skillBtn = this.container.querySelector("#skillButton");
    this.itemBtn = this.container.querySelector("#itemButton");
    this.runBtn = this.container.querySelector("#runButton");
    this.commandButtons = [this.attackBtn, this.skillBtn, this.itemBtn, this.runBtn];

    document.body.appendChild(this.container);

    // 要素キャッシュ
    this.enemyImage = this.container.querySelector("#battleEnemyImage");
    this.enemyName = this.container.querySelector("#battleEnemyName");
    this.enemyHpFill = this.container.querySelector("#enemyHpFill");
    this.playerHpFill = this.container.querySelector("#playerHpFill");
    this.playerMpFill = this.container.querySelector("#playerMpFill");
    this.playerHpText = this.container.querySelector("#playerHpText");
    this.playerMpText = this.container.querySelector("#playerMpText");
    this.partyArea = this.container.querySelector("#partyArea");
    this.logElem = this.container.querySelector("#battleLog");

    // ターゲット要素
    this.enemyTargetArea = this.container.querySelector("#enemyTarget");
    this.targetWindow = this.container.querySelector("#targetWindow");
    this.cancelTargetBtn = this.container.querySelector("#cancelTargetButton");

    // イベント設定（安全にガード）
    this.attackBtn && (this.attackBtn.onclick = () => this.playerAttack());
    this.skillBtn && (this.skillBtn.onclick = () => this.openSkillWindow());
    this.itemBtn && (this.itemBtn.onclick = () => this.openItemWindow());
    this.runBtn && (this.runBtn.onclick = () => this.playerFlee());
    this.enemyTargetArea && (this.enemyTargetArea.onclick = () => { if (this.targetingMode) this.selectTarget('enemy', 0); });
    this.cancelTargetBtn && (this.cancelTargetBtn.onclick = () => this.hideTargetWindow());
  },

  show(enemy, partyMembers) {
    this.currentEnemy = enemy;
    this.partyMembers = partyMembers || [];

    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.style.display = "none";
    this.container.style.display = "flex";

    this.enemyName.textContent = enemy?.name ?? "？？？";
    this.enemyImage.src = enemy?.img || "images/enemies1.png";

    this.renderParty();
    this.updateDisplay();
  },

  enableCommands(actorIndex) {
    this.commandButtons.forEach(btn => { if (btn) btn.disabled = false; });
    this.selectedMemberIndex = actorIndex;
    this.renderParty();
  },

  disableCommands() {
    this.commandButtons.forEach(btn => { if (btn) btn.disabled = true; });
  },

  renderParty() {
    const members = this.partyMembers || [];
    this.partyArea.innerHTML = "";

    if (!members || members.length === 0) return;

    members.forEach((m, idx) => {
      const slot = document.createElement("div");
      slot.style.display = "flex";
      slot.style.flexDirection = "column";
      slot.style.alignItems = "center";
      slot.style.width = "72px";
      slot.style.cursor = "pointer";

      const img = document.createElement("img");
      img.src = m.img || "player.png";
      img.width = 48;
      img.height = 48;

      let borderColor = "transparent";
      if (idx === this.selectedMemberIndex && this.selectedMemberIndex !== null) {
        borderColor = "gold";
      } else if (this.targetingMode) {
        borderColor = "cyan";
      }
      img.style.border = `2px solid ${borderColor}`;

      const name = document.createElement("div");
      name.textContent = m.name || `仲間${idx}`;
      name.style.fontSize = "12px";
      name.style.marginTop = "4px";

      // HP/MP テキスト
      const statsTextContainer = document.createElement("div");
      statsTextContainer.style.fontSize = "10px";
      statsTextContainer.style.marginTop = "2px";
      statsTextContainer.style.width = "100%";
      statsTextContainer.style.textAlign = "center";

      const hpText = `${Math.max(0, m.hp ?? 0)}/${m.maxHp ?? 0}`;
      const mpText = `${Math.max(0, m.mp ?? 0)}/${m.maxMp ?? 0}`;
      statsTextContainer.innerHTML = `<span style="color:#0f0;">HP: ${hpText}</span><br><span style="color:#00f;">MP: ${mpText}</span>`;

      // Bars
      const barsContainer = document.createElement("div");
      barsContainer.style.display = "flex";
      barsContainer.style.gap = "4px";
      barsContainer.style.marginTop = "6px";

      const hpBar = document.createElement("div");
      hpBar.style.width = "30px";
      hpBar.style.height = "6px";
      hpBar.style.background = "#333";
      hpBar.style.borderRadius = "6px";
      const hpFill = document.createElement("div");
      hpFill.style.height = "100%";
      const hpRatio = (m.maxHp && m.maxHp > 0) ? Math.max(0, m.hp ?? 0) / m.maxHp : 0;
      let hpColor = "#0f0";
      if (hpRatio < 0.5) hpColor = "#ff0";
      if (hpRatio < 0.2) hpColor = "#f00";
      hpFill.style.width = (hpRatio * 100) + "%";
      hpFill.style.background = hpColor;
      hpFill.style.borderRadius = "6px";
      hpBar.appendChild(hpFill);

      const mpBar = document.createElement("div");
      mpBar.style.width = "30px";
      mpBar.style.height = "6px";
      mpBar.style.background = "#333";
      mpBar.style.borderRadius = "6px";
      const mpFill = document.createElement("div");
      mpFill.style.height = "100%";
      const mpRatio = (m.maxMp && m.maxMp > 0) ? Math.max(0, m.mp ?? 0) / m.maxMp : 0;
      mpFill.style.width = (mpRatio * 100) + "%";
      mpFill.style.background = "#00f";
      mpFill.style.borderRadius = "6px";
      mpBar.appendChild(mpFill);

      barsContainer.appendChild(hpBar);
      barsContainer.appendChild(mpBar);

      // バフ・ステータス効果表示 (m.buffs または m.statusEffects に対応)
      const buffContainer = document.createElement("div");
      buffContainer.style.display = "flex";
      buffContainer.style.gap = "3px";
      buffContainer.style.marginTop = "4px";
      buffContainer.style.flexWrap = "wrap";

      const buffs = Array.isArray(m.buffs) ? m.buffs : (Array.isArray(m.statusEffects) ? m.statusEffects : []);
      buffs.forEach(buff => {
        // buff は { name, duration, amount, description } または statusEffects 形式でも許容
        const icon = document.createElement("div");
        icon.style.width = "14px";
        icon.style.height = "14px";
        icon.style.borderRadius = "3px";
        icon.style.background = "gold";
        icon.style.color = "black";
        icon.style.fontSize = "10px";
        icon.style.display = "flex";
        icon.style.alignItems = "center";
        icon.style.justifyContent = "center";
        icon.style.cursor = "pointer";

        const dur = (buff.duration ?? buff.remainingTurns ?? 0);
        icon.textContent = String(dur);

        const titleName = buff.name ?? buff.id ?? buff.stat ?? "効果";
        const desc = buff.description ?? `${buff.amount ?? ""} (${buff.stat ?? ""})`;
        icon.title = `${titleName}（残り${dur}ターン）\n${desc}`;

        icon.onclick = (e) => {
          e.stopPropagation();
          // シンプルなダイアログ。必要ならカスタムUIに置き換えてください。
          alert(`${titleName}\n効果：${desc}\n残り：${dur}ターン`);
        };

        buffContainer.appendChild(icon);
      });

      // 要素を slot に追加（順序を整理）
      slot.appendChild(img);
      slot.appendChild(name);
      slot.appendChild(statsTextContainer);
      slot.appendChild(barsContainer);
      slot.appendChild(buffContainer);

      // クリックでターゲット選択（ターゲットモード時のみ）
      slot.onclick = () => {
        if (this.targetingMode) this.selectTarget('ally', idx);
      };

      this.partyArea.appendChild(slot);
    });
  },

  // --- skill window ---
  openSkillWindow() {
    this.disableCommands();
    if (this.skillWindow) this.skillWindow.remove();

    this.skillWindow = document.createElement("div");
    Object.assign(this.skillWindow.style, {
      position: "absolute",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.9)",
      padding: "15px",
      border: "1px solid white",
      borderRadius: "8px",
      width: "260px",
      maxHeight: "220px",
      overflowY: "auto",
      zIndex: "1500"
    });

    const actor = this.partyMembers[this.selectedMemberIndex];
    if (!actor) {
      this.log("エラー: 行動アクターが見つかりません。");
      this.enableCommands(this.selectedMemberIndex);
      return;
    }

    const actorSkills = actor.skills || [];
    const skillList = actorSkills.map(id => window.skills?.[id]).filter(s => s);

    if (skillList.length === 0) {
      const msg = document.createElement("div");
      msg.textContent = `${actor.name} は使えるスキルがありません。`;
      msg.style.marginBottom = "10px";
      this.skillWindow.appendChild(msg);

      const backButton = document.createElement('button');
      backButton.textContent = 'コマンドに戻る';
      backButton.style.width = "100%";
      backButton.onclick = () => {
        this.closeSkillWindow();
        this.enableCommands(this.selectedMemberIndex);
      };
      this.skillWindow.appendChild(backButton);

    } else {
      skillList.forEach(skill => {
        const b = document.createElement("button");
        const isUsable = (skill.mp ?? 0) <= (actor.mp ?? 0);

        b.textContent = skill.name + ` (MP: ${skill.mp || 0})`;
        b.style.width = "100%";
        b.style.marginBottom = "6px";
        b.disabled = !isUsable;

        b.onclick = () => {
          // ターゲット選択モードへ (actionData は skill オブジェクト)
          this.startTargeting('skill', skill);
          this.closeSkillWindow();
        };
        this.skillWindow.appendChild(b);
      });

      const backButton = document.createElement('button');
      backButton.textContent = '戻る (キャンセル)';
      backButton.style.width = "100%";
      backButton.onclick = () => {
        this.closeSkillWindow();
        this.enableCommands(this.selectedMemberIndex);
      };
      this.skillWindow.appendChild(backButton);
    }

    document.body.appendChild(this.skillWindow);
  },

  closeSkillWindow() {
    if (this.skillWindow) {
      this.skillWindow.remove();
      this.skillWindow = null;
    }
  },

  // --- item window ---
  openItemWindow() {
    this.disableCommands();
    if (this.itemWindow) this.itemWindow.remove();

    this.itemWindow = document.createElement("div");
    Object.assign(this.itemWindow.style, {
      position: "absolute",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.9)",
      padding: "15px",
      border: "1px solid white",
      borderRadius: "8px",
      width: "260px",
      maxHeight: "220px",
      overflowY: "auto",
      zIndex: "1500"
    });

    const actor = this.partyMembers[this.selectedMemberIndex];
    if (!actor) {
      this.log("エラー: 行動アクターが見つかりません。");
      this.enableCommands(this.selectedMemberIndex);
      return;
    }

    const inventory = window.inventory || [];

    // window.items を配列でもオブジェクトでも扱えるようにする
    let itemMap = window.items || {};
    if (Array.isArray(window.items)) {
      itemMap = window.items.reduce((acc, it) => { if (it && it.id) acc[it.id] = it; return acc; }, {});
    }

    const usableItems = inventory.map(invItem => {
      const itemData = itemMap[invItem.id];
      if (invItem.quantity > 0 && itemData && ['heal', 'mp', 'full'].includes(itemData.type)) {
        return { invId: invItem.id, quantity: invItem.quantity, data: itemData };
      }
      return null;
    }).filter(i => i);

    if (usableItems.length === 0) {
      const msg = document.createElement("div");
      msg.textContent = `使える消費アイテムがありません。`;
      msg.style.marginBottom = "10px";
      this.itemWindow.appendChild(msg);
    } else {
      usableItems.forEach(item => {
        const itemData = item.data;
        const b = document.createElement("button");
        b.textContent = `${itemData.name} (${item.quantity})`;
        b.style.width = "100%";
        b.style.marginBottom = "6px";
        b.onclick = () => {
          // ターゲット選択モードへ (actionData は { itemData, itemId })
          this.startTargeting('item', { itemData, itemId: item.invId });
          this.closeItemWindow();
        };
        this.itemWindow.appendChild(b);
      });
    }

    const backButton = document.createElement('button');
    backButton.textContent = '戻る (キャンセル)';
    backButton.style.width = "100%";
    backButton.style.marginTop = "10px";
    backButton.onclick = () => {
      this.closeItemWindow();
      this.enableCommands(this.selectedMemberIndex);
    };
    this.itemWindow.appendChild(backButton);

    document.body.appendChild(this.itemWindow);
  },

  closeItemWindow() {
    if (this.itemWindow) {
      this.itemWindow.remove();
      this.itemWindow = null;
    }
  },

  // --- ターゲット選択関連 ---
  startTargeting(actionType, actionData = null) {
    this.targetingMode = true;
    this.currentAction = { type: actionType, data: actionData };
    this.disableCommands();
    this.showTargetWindow();
    this.renderParty();

    let targetPrompt = "ターゲットを選択してください。";
    if (actionType === 'skill' && actionData) {
      targetPrompt = `${actionData.name} を誰に使いますか？`;
    } else if (actionType === 'item' && actionData && actionData.itemData) {
      targetPrompt = `${actionData.itemData.name} を誰に使いますか？`;
    } else if (actionType === 'attack') {
      targetPrompt = `誰に攻撃しますか？`;
    }
    if (this.targetWindow) this.targetWindow.querySelector('div').textContent = targetPrompt;
  },

  showTargetWindow() {
    if (this.targetWindow) this.targetWindow.style.display = 'block';
  },

  hideTargetWindow() {
    this.targetingMode = false;
    this.currentAction = null;
    if (this.targetWindow) this.targetWindow.style.display = 'none';
    // enableCommands の呼び出しは存在するUI要素があることを確認してから
    this.enableCommands(this.selectedMemberIndex);
    this.renderParty();
  },

  selectTarget(targetType, targetIndex) {
    if (!this.targetingMode) return;
    const actorIndex = this.selectedMemberIndex;
    const action = this.currentAction;
    if (!action) return;

    // action.data を壊さないよう新オブジェクトで渡す
    const actionDataWithTarget = {
      ... (action.data || {}),
      targetType,
      targetIndex
    };

    // 呼び出し先の仕様に合わせて executeAction を呼ぶ
    if (window.battleManager && typeof window.battleManager.executeAction === 'function') {
      window.battleManager.executeAction(actorIndex, action.type, actionDataWithTarget);
    } else {
      this.log("エラー: battleManager.executeAction が見つかりません。");
    }

    this.hideTargetWindow();
  },

  playerUseItem(itemData, itemId) {
    this.startTargeting('item', { itemData, itemId });
  },

  playerAttack() {
    this.startTargeting('attack');
  },

  playerFlee() {
    if (window.battleManager && typeof window.battleManager.executeAction === 'function') {
      window.battleManager.executeAction(this.selectedMemberIndex, 'run');
    }
  },

  hide() {
    this.container.style.display = "none";
    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.style.display = "";

    if (typeof draw === "function") {
      try {
        const ctx = canvas.getContext("2d");
        draw(ctx, window.currentMap, window.playerStatus.x, window.playerStatus.y);
      } catch (e) { /* ignore */ }
    }

    this.currentEnemy = null;
    this.partyMembers = [];
    this.selectedMemberIndex = null;
    this.closeSkillWindow();
    this.closeItemWindow();
    this.hideTargetWindow();
  },

  updateDisplay() {
    if (!this.currentEnemy) return;

    // 敵HPバー
    if (this.enemyHpFill && this.currentEnemy.maxHp > 0) {
      const w = Math.max(0, Math.min(1, (this.currentEnemy.hp ?? 0) / this.currentEnemy.maxHp)) * 100;
      this.enemyHpFill.style.width = w + "%";
    }

    // 主人公表示（フィールドの playerStatus を参照）
    const player = window.playerStatus || {};
    if (this.playerHpFill && typeof player.maxHp === 'number' && typeof player.hp === 'number') {
      const w = Math.max(0, Math.min(1, player.hp / player.maxHp)) * 100;
      this.playerHpFill.style.width = w + "%";
      if (this.playerHpText) this.playerHpText.textContent = `HP: ${Math.max(0, player.hp)} / ${player.maxHp}`;
    }
    if (this.playerMpFill && typeof player.maxMp === 'number' && typeof player.mp === 'number') {
      if (player.maxMp > 0) {
        const w = Math.max(0, Math.min(1, player.mp / player.maxMp)) * 100;
        this.playerMpFill.style.width = w + "%";
        if (this.playerMpText) this.playerMpText.textContent = `MP: ${Math.max(0, player.mp)} / ${player.maxMp}`;
      } else {
        if (this.playerMpText) this.playerMpText.textContent = `MP: -`;
      }
    }

    this.renderParty();
  },

  log(text) {
    if (!this.logElem) return;
    this.logElem.textContent = text;
  }
};

window.addEventListener("load", () => {
  // safety: battleUI がまだロードされていれば init
  if (window.battleUI && typeof window.battleUI.init === 'function') window.battleUI.init();
});
