export const bossMessage = (bosses) => {
            switch(bosses){   
                case 0:
                    return "Eikthyr still rallies the creatures of the forest.";      
                case 1:
                    return "The Elder's forest grows restless.";
                case 2:
                    return "A foul smell drifts from the swamps Bonemass calls home.";
                case 3:
                    return "Moder extends her challenge from the Mountains.";  
                case 4:
                    return "The horde marches with Yagluth's blessing.";
                case 5:
                    return "The tenth realm has settled to an uneasy calm.";  
                default:

            }
}

export const bossHelper = (bosses) => {
    const enemies = ['Eikthyr', 'The Elder', 'Bonemass', 'Moder', 'Yagluth']
    const defeatedEnemies = [];
    for (let i = 0; i < bosses; i++){
        defeatedEnemies.push(enemies[i])
    }

    return defeatedEnemies;
}

export const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }


export const sendingText = (search) =>{
    return search.replace(/ /g, '_').toLowerCase()
}