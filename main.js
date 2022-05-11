let gameContainer = document.querySelector('.game')

let gameBlock = document.querySelector('.game_block')

for (let index = 1; index < Math.pow(6, 2); index++) {
    gameContainer.append(gameBlock.cloneNode(true))
}
