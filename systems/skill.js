// --- skills.js (バフ対応・仲間スキル正式版) ---

// スキル一覧（BattleManager が参照する前提）
window.skills = {

  // -----------------------------------------
  // 〈赤の王〉プレイヤー専用スキル
  // -----------------------------------------
  powerSlash: {
    id: "powerSlash",
    name: "王剣斬り",
    type: "attack",
    power: 1.6,   // 1.6倍攻撃
    mp: 10,
    targetType: "enemy",   // BattleManager 用の明示ターゲット
    target: "enemy_single"
  },


  // -----------------------------------------
  // アレキサンドリア（物理アタッカー）スキル
  // -----------------------------------------
  doubleStrike: {
    id: "doubleStrike",
    name: "玄人斬り",
    type: "attack",
    power: 1.2,     // 1.2倍 × 2回（実装は battle.js で2回攻撃仕様を追加可能）
    mp: 15,
    hits: 2,        // ★ 追加：将来 2回攻撃 用に保持
    targetType: "enemy",
    target: "enemy_single"
  },


  // -----------------------------------------
  // 〈白の神官女〉（バフ・支援型）スキル
  // -----------------------------------------
  healingLight: {
    id: "healingLight",
    name: "狂騒の舞",
    type: "buff",     // バフスキル
    stat: "attack",   // 強化するステータス
    amount: 5,        // 上昇値
    duration: 3,      // ターン数
    mp: 12,
    targetType: "ally",
    target: "ally_single"
  },


  // -----------------------------------------
  // 今後追加するためのテンプレ
  // -----------------------------------------
  /*
  sampleSkill: {
    id: "sampleSkill",
    name: "サンプル技",
    type: "attack" | "heal" | "buff" | "debuff",
    power: 1.0,        // 攻撃系
    amount: 30,        // 回復量 or 強化量
    stat: "attack",    // 強化対象パラメータ
    duration: 3,
    mp: 5,
    targetType: "enemy" | "ally",
    target: "enemy_single" | "enemy_all" | "ally_single" | "ally_all"
  }
  */
};
