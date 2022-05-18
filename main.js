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

function getNewRandomValueFromArray(currentArray, randomArray) {
	let cardValue = randomArray[Math.floor(Math.random() * randomArray.length)];

	if (currentArray.indexOf(cardValue) != -1) {
		return getNewRandomValueFromArray(currentArray, randomArray);
	}
	return cardValue;
}

const alphabet = ['a', 'b', 'c', 'd', 'e',
	          'f', 'g', 'h', 'i', 'j',
                  'k', 'l', 'm', 'n', 'o',
                  'p', 'q', 'r', 's', 't',
                  'u', 'v', 'w', 'x', 'y',
                  'z'];

let letterArray = [];

for (let index = 0; index < Math.pow(6, 2) / 2; index++) {
	let cardValue = getNewRandomValueFromArray(letterArray, alphabet);
    	letterArray.push(cardValue);
}

for (let index = 0; index < Math.pow(6, 2); index++) {
    let block = createBlock();

    block.innerText = cardValue;

    if (Math.random() < 0.15) {
        block.classList.add("selected");
    }

    if (Math.random() < 0.15) {
        block.classList.add("correct");
    }

    gameContainer.append(block);
}
