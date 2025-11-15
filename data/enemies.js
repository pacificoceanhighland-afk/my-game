window.enemies = [
  {
    id: "minotaur",
    name: "ミノタウロス",
    hp: 100,
    attack: 20,
    sprite: "images/enemies1.png",
    img: null
  }
];

enemies.forEach(e => {
  e.img = new Image();
  e.img.src = e.sprite;
});