// mapTransitions.js
window.mapTransitions = [
  // 王の私室 ⇄ 宮殿内部
  { from: kingRoom, tile: 2, to: palaceInside, spawnX: 1, spawnY: 8 },
  { from: palaceInside, tile: 3, to: kingRoom, spawnX: 5, spawnY: 1 },
  
  // 宮殿内部 ⇄ 宮殿外部
  { from: palaceInside, tile: 4, to: palaceOutside, spawnX: 2, spawnY: 10 },
  { from: palaceOutside, tile:5, to: palaceInside, spawnX: 10, spawnY: 1 },

  // 宮殿外部 ⇄ 城下町①
  { from: palaceOutside, tile: 6, to: castleTown1, spawnX: 0, spawnY: 5 },
  { from: castleTown1, tile: 7, to: palaceOutside, spawnX: 15, spawnY: 5 },

  // 城下町① ⇄ 城下町②
  { from: castleTown1, tile: 8, to: castleTown2, spawnX: 0, spawnY: 5 },
  { from: castleTown2, tile: 9, to: castleTown1, spawnX: 15, spawnY: 5 },

  // 城下町① ⇄ 城下町③
  { from: castleTown1, tile: 10, to: castleTown3, spawnX: 5, spawnY: 0 },
  { from: castleTown3, tile: 11, to: castleTown1, spawnX: 5, spawnY: 10 },

  // 城下町① ⇄ 神域①
  { from: castleTown1, tile: 12, to: sacredArea1, spawnX: 5, spawnY: 12 },
  { from: sacredArea1, tile: 13, to: castleTown1, spawnX: 5, spawnY: 0 },

  // 城下町① ⇄ 道具屋
  { from: castleTown1, tile: 22, to: itemShop, spawnX: 3, spawnY: 5 },
  { from: itemShop, tile: 23, to: castleTown1, spawnX: 8, spawnY: 5 },

  // 神域① ⇄ 神域②
  { from: sacredArea1, tile: 14, to: sacredArea2, spawnX: 5, spawnY: 12 },
  { from: sacredArea2, tile: 15, to: sacredArea1, spawnX: 5, spawnY: 0 },

  // 神域① ⇄ 神殿内部
  { from: sacredArea1, tile: 16, to: templeInside, spawnX: 5, spawnY: 11 },
  { from: templeInside, tile: 17, to: sacredArea1, spawnX: 8, spawnY: 6 },

  // 神域② ⇄ 迷宮①
  { from: sacredArea2, tile: 18, to: labyrinth1, spawnX: 4, spawnY: 4 },
  { from: labyrinth1, tile: 19, to: sacredArea2, spawnX: 8, spawnY: 1 },

  // 迷宮① ⇄ 迷宮②
  { from: labyrinth1, tile: 20, to: labyrinth2, spawnX: 5, spawnY: 6 },
  { from: labyrinth2, tile: 21, to: labyrinth1, spawnX: 7, spawnY: 1 },

  // 迷宮② ⇄ 迷宮③
  { from: labyrinth2, tile: 24, to: labyrinth3, spawnX: 4, spawnY: 4 },
  { from: labyrinth3, tile: 26, to: labyrinth2, spawnX: 1, spawnY: 1 },

  // 迷宮② ⇄ 迷宮④
  { from: labyrinth2, tile: 25, to: labyrinth4, spawnX: 4, spawnY: 4 },
  { from: labyrinth4, tile: 27, to: labyrinth2, spawnX: 9, spawnY: 1 },

  // 迷宮④ ⇄ 迷宮⑤
  { from: labyrinth4, tile: 28, to: labyrinth5, spawnX: 10, spawnY: 9 },
  { from: labyrinth5, tile: 29, to: labyrinth4, spawnX: 7, spawnY: 1 },
];