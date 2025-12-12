// --- playerStatus.js（最新安定版 / party.js と完全互換） ---

// party.js の createLevelUpMethods を利用
const _playerLevelCommon = window.createLevelUpMethods
  ? window.createLevelUpMethods()
  : {
      calculateNextExp() { return this.level * 100; },
      gainExp() {},
      levelUp() {}
    };

// プレイヤーステータス
window.playerStatus = {
  name: "〈赤の王〉",

  level: 1,
  hp: 100,
  maxHp: 100,
  mp: 30,
  maxMp: 30,
  attack: 12,
  defense: 9,

  exp: 0,
  nextExp: 100,
  gold: 50,

  skills: ["powerSlash", "heal"],

  image: "images/player.png",
  imageSize: 400,
  imageLeft: 0,
  imageBottom: 0,

  weapon: null,
  armor: null,

  // 共通経験値システムを取り込む
  ..._playerLevelCommon,

  // ------------------------------------------------------
  // ★ プレイヤー専用のレベルアップ処理（共通より優先される）
  // ------------------------------------------------------
  levelUp() {
    this.level++;

    this.maxHp += 20;
    this.maxMp += 5;
    this.attack += 3;
    this.defense += 2;

    this.hp = this.maxHp;
    this.mp = this.maxMp;

    this.nextExp = this.calculateNextExp();

    console.log(`🎉 ${this.name} はレベル ${this.level} に上がった！`);
  },

  // ------------------------------------------------------
  // ★ Gold 操作（今後のショップ用）
  // ------------------------------------------------------
  addGold(amount) {
    this.gold = Math.max(0, this.gold + amount);
  },
  spendGold(amount) {
    if (this.gold >= amount) {
      this.gold -= amount;
      return true;
    }
    return false;
  },

  // ------------------------------------------------------
  // プレイヤー画像変更
  // ------------------------------------------------------
  setPlayerImage(newImage, newSize, newLeft, newBottom) {
    if (newImage) this.image = newImage;
    if (newSize !== undefined) this.imageSize = newSize;
    if (newLeft !== undefined) this.imageLeft = newLeft;
    if (newBottom !== undefined) this.imageBottom = newBottom;

    const playerImage = document.getElementById("playerImage");
    if (playerImage) {
      playerImage.src = this.image;
      playerImage.style.width = this.imageSize + "px";
      playerImage.style.left = this.imageLeft + "px";
      playerImage.style.bottom = this.imageBottom + "px";
    }
  },

  // ------------------------------------------------------
  // 装備込みステータス
  // ------------------------------------------------------
  get totalAttack() {
    return this.attack + (this.weapon?.attack ?? 0);
  },

  get totalDefense() {
    return this.defense + (this.armor?.defense ?? 0);
  },

  // ------------------------------------------------------
  // ダメージ処理
  // ------------------------------------------------------
  takeDamage(dmg) {
    this.hp = Math.max(0, this.hp - dmg);
  },

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }
};

// 初期画像反映
window.addEventListener("DOMContentLoaded", () => {
  window.playerStatus.setPlayerImage(
    window.playerStatus.image,
    window.playerStatus.imageSize,
    window.playerStatus.imageLeft,
    window.playerStatus.imageBottom
  );
});
