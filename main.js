const gameOptions = {
    boardSize: 6,
    selectedColor: "#",
    cardType: 'alphabet',
    jwt: "",
    username: "",
    user_role: ""
}

const gameContainer = document.querySelector(".game")
const cardStates = ["default", "selected", "correct"]
const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

let cardNum = Math.pow(gameOptions.boardSize, 2)

// Initialization
function purgeGameBoard() {
    document.querySelector('.game').innerHTML = ""
    document.querySelector("#unsaved_changes").style.setProperty('display', 'none')
}

function updateBoardCSS() {
    document.querySelector(':root')
        .style.setProperty(
            "--board-size",
            gameOptions.boardSize
        )
}

function getJWT() {
    let JWT = localStorage.getItem("JWT")
    
    if (JWT) {

        var base64Url = JWT.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        console.log(jsonPayload)
        return JSON.parse(jsonPayload);
    } else {
        console.log('not logged in')
    }
}

function initialize() {
    getJWT()
    purgeGameBoard()
    updateBoardCSS()

    cardNum = Math.pow(gameOptions.boardSize, 2)
    switch (gameOptions.cardType) {
        case "picsum":
            createPicsumBoard()
            break;
        case "dogceo":
            createDogCeoBoard()
            break;
        case "reddit":
            createRedditBoard()
            break;
        case "alphabet":
        default:
            createAlphabetBoard()
    }
}


// API's
function getDogPictures(imageCount) {
    return fetch(`https://dog.ceo/api/breeds/image/random/${imageCount}`)
        .then(data => data.json())
        .then(data => data.message)
}

function getRandomPicture() {
    return fetch("https://picsum.photos/200")
        .then(response => response.url)
}


// Get value and check if there is no duplicate recursively
function getNewRandomValueFromArray(currentArray, randomArray) {
    let cardValue = randomArray[Math.floor(Math.random() * randomArray.length)]

    for (const val of currentArray) {
        if (val[0] == cardValue) {
            return getNewRandomValueFromArray(currentArray, randomArray)
        }
    }
    return cardValue
}

function getRandomValue(currentArray, getFunction) {
    return getFunction().then(cardValue => {
        for (const val of currentArray) {
            if (val[0] == cardValue) {
                return getNewRandomValueFromArray(currentArray, getFunction)
            }
        }
        return cardValue
    })
}

// Board creation w/wo API
function createAlphabetBoard() {
    let cardValues = []
    for (let index = 0; index < cardNum / 2; index++) {
        let cardValue = getNewRandomValueFromArray(cardValues, alphabet)
        cardValues.push([cardValue, index])
    }
    createCardBlocks(cardValues, "text")
}

function createPicsumBoard() {
    let cardValues = []
    for (let index = 0; index < cardNum / 2; index++) {

        getRandomValue(cardValues, getRandomPicture).then(cardValue => {
            cardValues.push([cardValue, index])
            if (cardValues.length == cardNum / 2) {
                createCardBlocks(cardValues, "image")
            }
        })
    }
}

function createRedditBoard() {
    const subreddit = 'art'
    return fetch(`http://www.reddit.com/r/${subreddit}.json?limit=100&sort=top&t=all'.format(subreddit=srr))`)
        .then(data => data.json())
        .then(data => {

            let pictureCount = 0
            let pictures = []
            let index = 2
            while (pictureCount < cardNum / 2) {

                let post = data['data']['children'][index]['data']
                if (post['is_reddit_media_domain'] && !post['is_video']) {
                    pictureCount++
                    pictures.push([post['url'], index])
                }
                index++
                if (index >= data['data']['children'].length) {
                    break
                }
            }

            createCardBlocks(pictures, "image")
        })
}

function createDogCeoBoard() {
    let cardValues = []
    getDogPictures(cardNum / 2).then(data => {
        data.forEach((cardValue, index) => cardValues.push([cardValue, index]))
        createCardBlocks(cardValues, "image")
    })
}

// Board Creation
function createCardBlocks(cardValues, type) {
    // Duplicate values in array
    cardValues.push(...cardValues)

    // Shuffle array
    cardValues = cardValues
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    for (let index = 0; index < cardNum; index++) {
        let card = createCard(cardValues[index][0], cardValues[index][1], type)

        gameContainer.append(card)
    }
}

function createCard(value, index, type) {
    let gameBlock = document.createElement("div")
    gameBlock.classList.add("game_block")
    gameBlock.setAttribute("data-id", index)

    let gameBlockInner = document.createElement("div")
    gameBlockInner.classList.add("block_inner")

    gameBlock.appendChild(gameBlockInner);
    let blockValue
    if (type == "text") {
        blockValue = document.createElement("div")
        blockValue.innerText = value;
        blockValue.classList.add("value")
    } else {
        blockValue = document.createElement("div")
        blockValue.style.backgroundImage = `url("${value}")`
        blockValue.classList.add("value")
    }

    let blockPlaceholder = document.createElement("div")
    blockPlaceholder.innerHTML = "*"
    blockPlaceholder.classList.add("placeholder")

    gameBlockInner.appendChild(blockValue)
    gameBlockInner.appendChild(blockPlaceholder)

    return gameBlock
}


function checkIfSelectedOrCorrect(selectedBlock) {

    if (!(selectedBlock.classList.contains("game_block")
        || selectedBlock.classList.contains("block_inner")
        || selectedBlock.classList.contains("placeholder"))) {
        return false
    }

    if (selectedBlock.classList.contains("selected")
        || selectedBlock.classList.contains("correct")) {
        return false
    }

    return true
}

// Event listeners
function gameHandler() {
    let currentlySelectedBlock = null
    let resetOnNextClick = false

    // Handling clicks on cards
    gameContainer.addEventListener("click", el => {
        let selectedBlock = el.target

        if (selectedBlock.classList.contains("block_inner")) selectedBlock = selectedBlock.parentElement
        if (selectedBlock.classList.contains("placeholder")) selectedBlock = selectedBlock.parentElement.parentElement

        if (!checkIfSelectedOrCorrect(selectedBlock)) return

        if (resetOnNextClick) {
            document.querySelectorAll(".selected").forEach(el => el.classList.remove('selected'))
            resetOnNextClick = false
        }

        selectedBlock.classList.add('selected')

        if (currentlySelectedBlock) {
            if (currentlySelectedBlock == selectedBlock.dataset.id) {
                document.querySelectorAll(`div[data-id="${currentlySelectedBlock}"]`)
                    .forEach(el => el.classList.add('correct'))
                if (!document.querySelectorAll(".game_block:not(.correct)").length) {
                    document.querySelector('.win_screen').classList.add('show')
                }
            } else {
                resetOnNextClick = true
            }
            currentlySelectedBlock = null
        } else {
            currentlySelectedBlock = selectedBlock.dataset.id
        }
    })
}

// Handling win screen
let win_screen = document.querySelector(".win_screen")
win_screen.addEventListener("click", () => {
    win_screen.classList.remove("show")
})

// Setting event listeners
function updateCardColor(variable, color) {
    document.querySelector(':root')
        .style.setProperty(variable, color)
}

cardStates.forEach((cardState, index) => {
    document.querySelector(`#card_color_${cardState}`)
        .addEventListener("change", ev => {
            updateCardColor(`--card-color-${cardState}`, ev.target.value)
        })
})

document.querySelector("#card_type").addEventListener("change", updateCardType)

function updateCardType() {
    let dropdown = document.querySelector("#card_type")
    gameOptions.cardType = dropdown[dropdown.selectedIndex].index
    document.querySelector("#unsaved_changes").style.setProperty('display', 'block')
}

document.querySelector("#board_size").addEventListener("change", updateBoardSize)

function updateBoardSize() {
    let dropdown = document.querySelector("#board_size")
    gameOptions.boardSize = dropdown[dropdown.selectedIndex].value
    document.querySelector("#unsaved_changes").style.setProperty('display', 'block')
}

// Start default game
gameHandler()
updateCardType()
updateBoardSize()
initialize()