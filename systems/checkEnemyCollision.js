window.checkEnemyCollision = function(x, y, map){
    if(!map.enemies) return null;
    for(let e of map.enemies){
        if(e.x === x && e.y === y) return e;
    }
    return null;
};
