// プレイヤーの基本ステータス
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

  // 装備状態
  weapon: null,
  armor: null,

  // ステータス計算（装備反映）
  get totalAttack() {
    let atk = this.attack;
    if (this.weapon && this.weapon.attack) atk += this.weapon.attack;
    return atk;
  },

  get totalDefense() {
    let def = this.defense;
    if (this.armor && this.armor.defense) def += this.armor.defense;
    return def;
  },

  // ダメージ処理
  takeDamage(dmg) {
    this.hp -= dmg;
    if (this.hp < 0) this.hp = 0;
  },

  // 回復処理
  heal(amount) {
    this.hp += amount;
    if (this.hp > this.maxHp) this.hp = this.maxHp;
  },

  // 経験値・レベルアップ
  gainExp(amount) {
    this.exp += amount;
    if (this.exp >= this.nextExp) {
      this.levelUp();
    }
  },

  levelUp() {
    this.level++;
    this.exp = 0;
    this.nextExp += 50;
    this.maxHp += 20;
    this.maxMp += 5;
    this.attack += 3;
    this.defense += 2;
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    console.log(`${this.name}はレベル${this.level}になった！`);
  }
};
