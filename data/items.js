// ======================================================
// ① 既存のアイテム一覧（今まで通りの配列形式）
// ======================================================
window.items = [
  // 回復アイテム
  {
    id: 1,
    name: "オリーブの軟膏",
    description: "HPを50回復する。",
    type: "heal",
    healAmount: 50
  },
  {
    id: 2,
    name: "エーテル",
    description: "MPを30回復する。",
    type: "mp",
    healAmount: 30
  },
  {
    id: 3,
    name: "エリクサー",
    description: "HPとMPを全回復する。",
    type: "full"
  },

  // 武器
  {
    id: 10,
    name: "王剣",
    description: "攻撃力 +5",
    type: "weapon",
    attack: 5
  },

  // 防具
  {
    id: 20,
    name: "キトン",
    description: "防御力 +3",
    type: "armor",
    defense: 3
  },
  {
    id: 21,
    name: "サンダル",
    description: "防御力 +2",
    type: "armor",
    defense: 2
  }
];

// ======================================================
// ② カテゴリ別アイテム（武器・防具・回復）
// ======================================================
window.itemCategories = {
  weapon: [
    { id: 10, name: "王剣", attack: 5 }
  ],
  armor: [
    { id: 20, name: "キトン", defense: 3 },
    { id: 21, name: "サンダル", defense: 2 }
  ],
  heal: [
    { id: 1, name: "オリーブの軟膏", healAmount: 50 },
    { id: 2, name: "エーテル", healAmount: 30 },
    { id: 3, name: "エリクサー", healAmount: 9999 }
  ]
};

// ======================================================
// ③ 初期インベントリ（所持品）
// ======================================================
window.inventory = [
  { id: 1, quantity: 2 },
  { id: 10, quantity: 1 },
  { id: 20, quantity: 1 }
];