const gameOptions = {
    boardSize: 2,
    selectedColor: "#",
}

const gameContainer = document.querySelector(".game");

function createBlock(value, index) {
    let gameBlock = document.createElement("div");
    gameBlock.classList.add("game_block");
    gameBlock.setAttribute("data-id", index)

    let gameBlockInner = document.createElement("div");
    gameBlockInner.classList.add("block_inner");

    gameBlock.appendChild(gameBlockInner);

    let blockValue = document.createElement("div");
    blockValue.innerText = value;
    blockValue.classList.add("value");

    let blockPlaceholder = document.createElement("div");
    blockPlaceholder.innerHTML = "<p>*</p>";
    blockPlaceholder.classList.add("placeholder");

    gameBlockInner.appendChild(blockValue);
    gameBlockInner.appendChild(blockPlaceholder);


    return gameBlock;
}

function getNewRandomValueFromArray(currentArray, randomArray) {
    let cardValue = randomArray[Math.floor(Math.random() * randomArray.length)];

    // console.log(currentArray);
    for (const val of currentArray) {
        // console.log(val[0] == cardValue);
        if (val[0] == cardValue) {
            return getNewRandomValueFromArray(currentArray, randomArray);
        }
    }
    return cardValue;
}

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

let letterArray = [];

for (let index = 0; index < Math.pow(gameOptions.boardSize, 2) / 2; index++) {
    let cardValue = getNewRandomValueFromArray(letterArray, alphabet);
    letterArray.push([cardValue, index]);
}

letterArray.push(...letterArray)


letterArray = letterArray
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

for (let index = 0; index < Math.pow(gameOptions.boardSize, 2); index++) {
    let block = createBlock(letterArray[index][0], letterArray[index][1]);

    gameContainer.append(block);
}


let currentlySelectedBlock = null;

document.querySelector('.game').addEventListener("click", el => {
    let selectedBlock = el.target

    if (!(selectedBlock.classList.contains("game_block")
        || selectedBlock.classList.contains("block_inner")
        || selectedBlock.classList.contains("placeholder"))) {
        return
    }

    if (selectedBlock.classList.contains("block_inner")) {
        selectedBlock = selectedBlock.parentElement
    }
    if (selectedBlock.classList.contains("placeholder")) {
        selectedBlock = selectedBlock.parentElement.parentElement
    }
    if (selectedBlock.classList.contains("selected") || selectedBlock.classList.contains("correct")) return

    selectedBlock.classList.add('selected')

    if (currentlySelectedBlock) {
        if (currentlySelectedBlock == selectedBlock.dataset.id) {
            document.querySelectorAll(`div[data-id="${currentlySelectedBlock}"]`)
                .forEach(el => el.classList.add('correct'))
            if (!document.querySelectorAll(".game_block:not(.correct)").length) {
                document.querySelector('.win_screen').classList.add('show')
            }
        } else {
        }
        setTimeout(() => {
            document.querySelectorAll(".selected").forEach(el => el.classList.remove('selected'))
        }, 1000)
        currentlySelectedBlock = null
    } else {
        currentlySelectedBlock = selectedBlock.dataset.id
    }
})

let win_screen = document.querySelector(".win_screen")
win_screen.addEventListener("click", () => {
    win_screen.classList.remove("show")
})

function updateCardColor(variable, color) {

    document.querySelector(':root')
    .style.setProperty(
        variable, 
        color
    )
}

document.querySelector("#card_color_default")
    .addEventListener("change", ev => {
        updateCardColor('--card-color-default', ev.target.value)
    })

document.querySelector("#card_color_selected")
    .addEventListener("change", ev => {
        updateCardColor('--card-color-selected', ev.target.value)
    })

document.querySelector("#card_color_correct")
    .addEventListener("change", ev => {
        updateCardColor('--card-color-correct', ev.target.value)
    })
