// --- data/enemies.js（完全修正版：純粋データ定義） ---

// 敵データ一覧（純データ）
window.enemies = [
  {
    id: "minotaur",
    name: "ミノタウロス",

    hp: 100,
    maxHp: 100,
    attack: 20,
    defense: 5,

    exp: 30,     // 倒した時にもらえる経験値
    gold: 20,    // 倒した時にもらえるゴールド（★追加）

    img: "images/enemies1.png", // 描画用画像パス（Image生成は game.js）

    // ★ 行動パターン（将来 AI を追加したい時用）
    aiType: "aggressive",  // 改善: 攻撃特化AI / 今後の展開のためのフィールド
    skills: [],            // 敵専用スキルを後で追加可能
  }
];

// ★ 注意：Image オブジェクトの生成やプリロードは
//         game.js の loadAllAssets() 側で行うため
//         このファイルには記述しない。
