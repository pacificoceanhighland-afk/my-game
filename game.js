const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ======================================================
// フィールド定義 (変更なし)
// ======================================================
window.fields = {
  palace: {
    maps: { kingRoom, palaceInside, palaceOutside },
    east: "castleTown1",
    west: null,
    north: null,
    south: null,
  },
  castleTown1: {
    maps: { castleTown1, itemShop },
    east: "castleTown2",
    west: "palace",
    north: "sacredArea1",
    south: "castleTown3"
  },
  castleTown2: {
    maps: { castleTown2 },
    east: null,
    west: "castleTown1",
    north: null,
    south: null
  },
  castleTown3: {
    maps: { castleTown3 },
    east: null,
    west: null,
    north: "castleTown1",
    south: null
  },
  sacredArea1: {
    maps: { templeInside },
    east: null,
    west: null,
    north: "sacredArea2",
    south: "castleTown1"
  },
  sacredArea2: {
    maps: { labyrinth1, labyrinth2, labyrinth3, labyrinth4, labyrinth5 },
    east: null,
    west: null,
    north: null,
    south: "sacredArea1"
  }
};

// ======================================================
// プレイヤー/マップの初期設定
// ======================================================
let currentField = "palace";
window.playerName = "〈赤の王〉";
const playerImg = document.getElementById("playerImage");

// ★ 修正 1: currentMap の初期化をより安全にする
let currentMap = typeof kingRoom !== 'undefined' ? kingRoom : null; 
if (!currentMap) {
    console.error("初期マップ (kingRoom) が見つかりません。maps.jsの読み込み順序を確認してください。");
}
let playerX = 1;
let playerY = 4;

// 入力設定 (setupInputは未定義だが、存在を前提とする)
if (typeof setupInput === 'function') setupInput();


// ======================================================
// ★ フィールド/マップ切り替えロジック
// ======================================================

/**
 * フィールドを切り替える (例: 宮殿 -> 城下町)
 * @param {string} newFieldId - 目的地のフィールドID
 * @param {string} entranceMapName - 目的地のフィールド内で入るマップ名
 * @param {number} x - 目的地のX座標
 * @param {number} y - 目的地のY座標
 */
window.changeMap = function(newMap, x, y) {
    currentMap = newMap;
    playerX = x;
    playerY = y;
    
    // マップが切り替わったら再描画
    draw(ctx, currentMap, playerX, playerY);
    console.log(`マップが ${currentMap.name} に切り替わりました。`);
};

/**
 * フィールドを切り替える（例: 東側へ移動）
 * @param {string} direction - 'east', 'west', 'north', 'south'
 */
window.changeField = function(direction) {
    const currentFieldData = window.fields[currentField];
    const newFieldId = currentFieldData[direction];

    if (newFieldId && window.fields[newFieldId]) {
        currentField = newFieldId;
        const newFieldData = window.fields[currentField];
        
        // ★ 目的地の初期マップと座標を設定
        let newMap = Object.values(newFieldData.maps)[0]; // 新フィールドの最初のマップ
        let newX, newY;

        // 簡易的な出入口座標設定 (例: 西から入ったら東端に配置)
        if (direction === 'east') {
            newX = 1; // 新マップの西端
            newY = Math.floor(newMap.height / 2);
        } else if (direction === 'west') {
            newX = newMap.width - 2; // 新マップの東端
            newY = Math.floor(newMap.height / 2);
        } else if (direction === 'north') {
            newX = Math.floor(newMap.width / 2);
            newY = newMap.height - 2; // 新マップの南端
        } else if (direction === 'south') {
            newX = Math.floor(newMap.width / 2);
            newY = 1; // 新マップの北端
        }
        
        window.changeMap(newMap, newX, newY);
    } else {
        console.warn(`${currentField} の ${direction} 側には移動できません。`);
    }
};


// ======================================================
// 敵画像読み込み処理 (loadAllAssets関数は変更なし)
// ======================================================
window.enemyImages = {};

function loadAllAssets() {
    // ... (関数の中身は変更なし) ...
    const enemyList = window.enemies || []; 
    
    const imagesToLoad = [
        { src: "images/player.png", element: playerImg, id: "player" },
        ...enemyList.map(e => ({ src: e.img, id: e.id }))
    ].filter(a => a.src); 

    let loadedCount = 0;
    const totalCount = imagesToLoad.length;
    
    const startGame = () => {
        playerImg.style.display = "block";
        mainLoop(); 
    };

    if (totalCount === 0) {
        console.warn("[AssetLoader] ロード対象のアセットがありません。");
        startGame();
        return;
    }

    console.log(`[AssetLoader] ${totalCount}個の画像をロード中...`);

    imagesToLoad.forEach(asset => {
        const onAssetLoad = () => {
            loadedCount++;
            if (loadedCount === totalCount) startGame();
        };

        if (asset.element) {
            asset.element.onload = onAssetLoad;
            asset.element.onerror = () => {
                console.error(`[AssetLoader] プレイヤー画像 (${asset.src}) のロードに失敗しました。ファイルパスを確認してください。`);
                onAssetLoad(); 
            };
            asset.element.src = asset.src; 
        } else {
            const img = new Image();
            
            img.onload = onAssetLoad;
            img.onerror = () => {
                console.error(`[AssetLoader] 敵画像 (${asset.id}) のロードに失敗しました。パス: ${asset.src}`);
                onAssetLoad(); 
            };
            
            img.src = asset.src;
            window.enemyImages[asset.id] = img;
        }
    });
}


// ======================================================
// メインループ
// ======================================================
function mainLoop() {
  draw(ctx, currentMap, playerX, playerY);
  window.updateStatusWindow(); // ★ 既存の関数が呼び出される
  requestAnimationFrame(mainLoop);
}

// ======================================================
// ページロード後に全アセットのロードを開始
// ======================================================
window.onload = () => {
    loadAllAssets(); 
};