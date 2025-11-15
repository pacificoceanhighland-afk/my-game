const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// フィールド定義
window.fields = {
  palace: {
    maps: {
      kingRoom: kingRoom,
      palaceInside: palaceInside,
      palaceOutside: palaceOutside
    },
    east: "castleTown1",
    west: null,
    north: null,
    south: null,
  },
  castleTown1: {
    maps: {
      itemShop: itemShop
    },
    east: "castleTown2",
    west: "palace",
    north: "sacredArea1",
    south: "castleTown3"
  },
  castleTown2: {
    maps: {
      town: castleTown2
    },
    east: null,
    west: "castleTown1",
    north: null,
    south: null
  },
  castleTown3: {
    maps: {
      town: castleTown3
    },
    east: null,
    west: null,
    north: "castleTown1",
    south: null
  },
  sacredArea1: {
    maps: {
      area: templeInside
    },
    east: null,
    west: null,
    north: "sacredArea2",
    south: "castleTown1"
  },
  sacredArea2: {
    maps: {
      labyrinth1: labyrinth1,
      labyrinth2: labyrinth2,
      labyrinth3: labyrinth3,
      labyrinth4: labyrinth4
    },
    east: null,
    west: null,
    north: null,
    south: "sacredArea1"
  }
};

// 現在のフィールド
let currentField = "palace";

// プレイヤー画像の読み込み
window.playerName = "〈赤の王〉";
const playerImg = document.getElementById("playerImage");
playerImg.src = "images/player.png";
playerImg.style.display = "block";

// 初期状態
let currentMap = kingRoom;
let playerX = 1;
let playerY = 4;

setupInput();

// メインループ
function mainLoop() {
  draw(ctx, currentMap, playerX, playerY);
  updateStatusWindow(); // ここで常にステータス更新
  requestAnimationFrame(mainLoop);
}

mainLoop();
