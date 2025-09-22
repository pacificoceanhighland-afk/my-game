const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 32;  // タイルの大きさ

// 初期状態
let currentMap = kingRoom;
let playerX = 1;
let playerY = 4;

// キー操作
document.addEventListener("keydown", (e) => {
  let nextX = playerX;
  let nextY = playerY;

  if(e.key === "ArrowUp") nextY--;
  if(e.key === "ArrowDown") nextY++;
  if(e.key === "ArrowLeft") nextX--;
  if(e.key === "ArrowRight") nextX++;
    
  // 範囲内かどうかをチェック
  if(nextY >= 0 && nextY < currentMap.map.length &&
     nextX >= 0 && nextX < currentMap.map[nextY].length){

    // tileを取得
    let tile = currentMap.map[nextY][nextX]; 

    // 壁でなければ移動
    if(tile !== 1){
      playerX = nextX;
      playerY = nextY;
    }

    // 王の私室 → 宮殿内部
    if(tile === 2 && currentMap === kingRoom){
      currentMap = palaceInside;
      playerX = 1; // 宮殿の入口付近
      playerY = 8;
    }

    // 宮殿内部 → 王の私室
    if(tile === 3 && currentMap === palaceInside){
      currentMap = kingRoom;
      playerX = 5; // 王の部屋の出口の横
      playerY = 1;
    }

    // 宮殿内部 → 宮殿外部
    if(tile === 4 && currentMap === palaceInside){
      currentMap = palaceOutside;
      playerX = 2; playerY = 10; // 宮殿外部の左下
    }

    // 宮殿外部 → 宮殿内部
    if(tile === 5 && currentMap === palaceOutside){
      currentMap = palaceInside;
      playerX = 10; playerY = 1; // 宮殿内部の右上
    }  
  }

    // スペースキーで会話
    if(e.key === " "){ // スペースキー
      for(let npc of npcs){
      if(currentMap === npc.map &&
         Math.abs(playerX - npc.x) + Math.abs(playerY - npc.y) === 1){
        showMessage(npc.text);
        return;
      }
    }
    // どのNPCとも話してなければ閉じる
    hideMessage();
  }
    
  draw();
});

// NPCの位置とセリフ
let npcs = [
  {x: 5, y: 4, map: palaceInside, text: "おはようございます、陛下！"}
];

// メッセージを表示する関数
function showMessage(text){
  const box = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");
  messageText.textContent = text;
  box.style.display = "block";
}

// メッセージを消す関数
function hideMessage(){
  const box = document.getElementById("messageBox");
  box.style.display = "none";
}

// 描画
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1)タイルを全部描画
  for(let y=0; y < currentMap.map.length; y++){
    for(let x=0; x < currentMap.map[y].length; x++){
      const tile = currentMap.map[y][x];
      if(tile === 1) ctx.fillStyle = "#808080"; // 壁
      if(tile === 0) ctx.fillStyle = currentMap.floorColor; // マップごとの床色
      if(tile === 2 || tile === 3 || tile === 4 || tile === 5) ctx.fillStyle = "#800000"; // 出入り口を茶色で描画
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  //NPC描画
  for(let npc of npcs){
    if(currentMap === npc.map){
      ctx.fillStyle = "#daa520"; //兵士
      ctx.fillRect(npc.x * tileSize, npc.y * tileSize, tileSize, tileSize);
    }
  }
    
  // プレイヤー描画
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(playerX * tileSize, playerY * tileSize, tileSize, tileSize);
}

// 初期描画
draw();
