let gameContainer = document.querySelector(".game");

function createBlock() {
    let gameBlock = document.createElement("div");
    gameBlock.classList.add("game_block");

    let gameBlockText = document.createElement("div");
    gameBlockText.innerText = "*";
    gameBlockText.classList.add("block_inner");

    gameBlock.appendChild(gameBlockText);

    return gameBlock;
}

for (let index = 0; index < Math.pow(6, 2); index++) {
    let block = createBlock();

    if (Math.random() < 0.15) {
        block.classList.add("selected");
    }

    if (Math.random() < 0.15) {
        block.classList.add("correct");
    }

    gameContainer.append(block);
}
