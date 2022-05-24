const gameOptions = {
    boardSize: 6,
    selectedColor: "#",
}

const gameContainer = document.querySelector(".game");

function createBlock(value) {
    let gameBlock = document.createElement("div");
    gameBlock.classList.add("game_block");

    let gameBlockText = document.createElement("div");
    gameBlockText.innerText = value;
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

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

let letterArray = [];

for (let index = 0; index < Math.pow(6, 2) / 2; index++) {
	let cardValue = getNewRandomValueFromArray(letterArray, alphabet);
    	letterArray.push(cardValue);
}

letterArray.push(...letterArray)


letterArray = letterArray
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)

for (let index = 0; index < Math.pow(6, 2); index++) {
    let block = createBlock(letterArray[index]);

    gameContainer.append(block);
}


let currentlySelectedBlock = null;

document.querySelector('.game').addEventListener("click", el => {
    let selectedBlock = el.target
    if (selectedBlock.classList.contains("game")) return
    if (selectedBlock.classList.contains("block_inner")) {
        selectedBlock = selectedBlock.parentElement
    }

    if (currentlySelectedBlock) {
        if (currentlySelectedBlock.innerText == selectedBlock.innerText) {
            console.log("match");
        }
    }
    console.log(selectedBlock);
})