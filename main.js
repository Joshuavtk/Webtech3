let gameContainer = document.querySelector('.game')

let gameBlock = document.querySelector('.game_block')

for (let index = 0; index < 35; index++) {
    gameContainer.append(gameBlock.cloneNode(true))
}
