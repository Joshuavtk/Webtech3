const gameOptions = {
    // Authentication
    jwt: "",
    user_id: 0,
    username: "",
    user_role: [],

    // Saved preferrences
    cardType: "",
    closedColor: "#",
    correctColor: "#",

    // Other preferrences
    boardSize: 6,
};

const gameContainer = document.querySelector(".game");

let cardNum = Math.pow(gameOptions.boardSize, 2);

// Initialization
function purgeGameBoard() {
    document.querySelector(".game").innerHTML = "";
    document
        .querySelector("#unsaved_changes")
        .style.setProperty("display", "none");
}

function updateBoardCSS() {
    document
        .querySelector(":root")
        .style.setProperty("--board-size", gameOptions.boardSize);
}

function getUserPreferences() {
    let decodedJWT = getJWTInfo();
    gameOptions.jwt = localStorage.getItem("JWT");
    gameOptions.user_id = decodedJWT[0].sub;
    gameOptions.username = decodedJWT[1].username;
    gameOptions.user_role = decodedJWT[1].roles;

    if (!gameOptions.user_role.includes("ROLE_ADMIN")) {
        document.querySelector("#admin_link").style.display = "none";
    }

    let id = gameOptions.user_id;
    let jwt = gameOptions.jwt;

    fetch(`${backend_url}/api/player/${id}/preferences`, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
        method: "GET",
    })
        .then((res) => {
            if (res.status !== 200) {
                localStorage.removeItem("JWT");
                window.location.href = frontend_url + "/login.html?msg=session_expired";
            }
            return res.json();
        })
        .then((data) => {
            if (data.preferred_api) {
                gameOptions.cardType = data.preferred_api;
                let typeSelector = document.querySelector("#card_type");

                typeSelector.selectedIndex =
                    typeSelector.children[gameOptions.cardType].index;
            }

            if (data.color_closed && data.color_closed.length > 1) {
                gameOptions.closedColor = data.color_closed;
                updateCardColor(
                    `--card-color-default`,
                    gameOptions.closedColor
                );
                document.querySelector("#card_color_default").value =
                    gameOptions.closedColor;
            }

            if (data.color_found && data.color_closed.length > 1) {
                gameOptions.correctColor = data.color_found;
                updateCardColor(
                    `--card-color-correct`,
                    gameOptions.correctColor
                );
                document.querySelector("#card_color_correct").value =
                    gameOptions.correctColor;
            }

            initialize();
        });
}

function setUserPreferences() {
    let u_id = gameOptions.user_id;
    let jwt = gameOptions.jwt;

    fetch(`${backend_url}/api/player/${u_id}/preferences`, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
        method: "POST",
        body: JSON.stringify({
            api: gameOptions.cardType,
            color_closed: gameOptions.closedColor,
            color_found: gameOptions.correctColor,
        }),
    });
}

function getUserScores() {
    fetch(`${backend_url}/scores`)
        .then((res) => res.json())
        .then((res) => {
            let scoreList = document.querySelector("#user_scores");

            res.sort(function (a, b) {
                return b.score - a.score;
            });
            res = res.slice(0, 5);

            res.forEach((score) => {
                let el = document.createElement("li");
                el.innerText = `${score.username}: ${score.score}`;
                scoreList.appendChild(el);
            });
        });
}

function initialize() {
    purgeGameBoard();
    updateBoardCSS();
    getUserScores();

    cardNum = Math.pow(gameOptions.boardSize, 2);
    switch (gameOptions.cardType) {
        case "picsum":
            createPicsumBoard();
            break;
        case "reddit":
            createRedditBoard();
            break;
        case "dogceo":
        default:
            createDogCeoBoard();
    }
}

// API's
function getDogPictures(imageCount) {
    return fetch(`https://dog.ceo/api/breeds/image/random/${imageCount}`)
        .then((data) => data.json())
        .then((data) => data.message);
}

function getRandomPicture() {
    return fetch("https://picsum.photos/200").then((response) => response.url);
}

// Get value and check if there is no duplicate recursively
function getNewRandomValueFromArray(currentArray, randomArray) {
    let cardValue = randomArray[Math.floor(Math.random() * randomArray.length)];

    for (const val of currentArray) {
        if (val[0] == cardValue) {
            return getNewRandomValueFromArray(currentArray, randomArray);
        }
    }
    return cardValue;
}

function getRandomValue(currentArray, getFunction) {
    return getFunction().then((cardValue) => {
        for (const val of currentArray) {
            if (val[0] == cardValue) {
                return getNewRandomValueFromArray(currentArray, getFunction);
            }
        }
        return cardValue;
    });
}

// Board creation w/wo API
function createPicsumBoard() {
    let cardValues = [];
    for (let index = 0; index < cardNum / 2; index++) {
        getRandomValue(cardValues, getRandomPicture).then((cardValue) => {
            cardValues.push([cardValue, index]);
            if (cardValues.length == cardNum / 2) {
                createCardBlocks(cardValues);
            }
        });
    }
}

function createRedditBoard() {
    const subreddit = "art";
    return fetch(
        `http://www.reddit.com/r/${subreddit}.json?limit=100&sort=top&t=all'.format(subreddit=srr))`
    )
        .then((data) => data.json())
        .then((data) => {
            let pictureCount = 0;
            let pictures = [];
            let index = 2;
            while (pictureCount < cardNum / 2) {
                let post = data["data"]["children"][index]["data"];
                if (post["is_reddit_media_domain"] && !post["is_video"]) {
                    pictureCount++;
                    pictures.push([post["url"], index]);
                }
                index++;
                if (index >= data["data"]["children"].length) {
                    break;
                }
            }

            createCardBlocks(pictures);
        });
}

function createDogCeoBoard() {
    let cardValues = [];
    getDogPictures(cardNum / 2).then((data) => {
        data.forEach((cardValue, index) => cardValues.push([cardValue, index]));
        createCardBlocks(cardValues);
    });
}

// Board Creation
function createCardBlocks(cardValues) {
    // Duplicate values in array
    cardValues.push(...cardValues);

    // Shuffle array
    cardValues = cardValues
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    for (let index = 0; index < cardNum; index++) {
        let card = createCard(cardValues[index][0], cardValues[index][1]);

        gameContainer.append(card);
    }
}

function createCard(value, index) {
    let gameBlock = document.createElement("div");
    gameBlock.classList.add("game_block");
    gameBlock.setAttribute("data-id", index);

    let gameBlockInner = document.createElement("div");
    gameBlockInner.classList.add("block_inner");

    gameBlock.appendChild(gameBlockInner);
    let blockValue = document.createElement("div");
    blockValue.style.backgroundImage = `url("${value}")`;
    blockValue.classList.add("value");

    let blockPlaceholder = document.createElement("div");
    blockPlaceholder.innerHTML = "*";
    blockPlaceholder.classList.add("placeholder");

    gameBlockInner.appendChild(blockValue);
    gameBlockInner.appendChild(blockPlaceholder);

    return gameBlock;
}

function checkIfSelectedOrCorrect(selectedBlock) {
    if (
        !(
            selectedBlock.classList.contains("game_block") ||
            selectedBlock.classList.contains("block_inner") ||
            selectedBlock.classList.contains("placeholder")
        )
    ) {
        return false;
    }

    if (
        selectedBlock.classList.contains("selected") ||
        selectedBlock.classList.contains("correct")
    ) {
        return false;
    }

    return true;
}

// Event listeners
function gameHandler() {
    let currentlySelectedBlock = null;
    let resetOnNextClick = false;

    // Handling clicks on cards
    gameContainer.addEventListener("click", (el) => {
        let selectedBlock = el.target;

        if (selectedBlock.classList.contains("block_inner"))
            selectedBlock = selectedBlock.parentElement;
        if (selectedBlock.classList.contains("placeholder"))
            selectedBlock = selectedBlock.parentElement.parentElement;

        if (!checkIfSelectedOrCorrect(selectedBlock)) return;

        if (resetOnNextClick) {
            document
                .querySelectorAll(".selected")
                .forEach((el) => el.classList.remove("selected"));
            resetOnNextClick = false;
        }

        selectedBlock.classList.add("selected");

        if (currentlySelectedBlock) {
            if (currentlySelectedBlock == selectedBlock.dataset.id) {
                document
                    .querySelectorAll(
                        `div[data-id="${currentlySelectedBlock}"]`
                    )
                    .forEach((el) => el.classList.add("correct"));
                if (
                    !document.querySelectorAll(".game_block:not(.correct)")
                        .length
                ) {
                    document.querySelector(".win_screen").classList.add("show");
                }
            } else {
                resetOnNextClick = true;
            }
            currentlySelectedBlock = null;
        } else {
            currentlySelectedBlock = selectedBlock.dataset.id;
        }
    });
}

// Handling win screen
let win_screen = document.querySelector(".win_screen");
win_screen.addEventListener("click", () => {
    win_screen.classList.remove("show");
});

// Setting event listeners
function updateCardColor(variable, color) {
    document.querySelector(":root").style.setProperty(variable, color);
}

document
    .querySelector(`#card_color_default`)
    .addEventListener("change", (ev) => {
        gameOptions.closedColor = ev.target.value;
        updateCardColor(`--card-color-default`, ev.target.value);
    });

document
    .querySelector(`#card_color_correct`)
    .addEventListener("change", (ev) => {
        gameOptions.correctColor = ev.target.value;
        updateCardColor(`--card-color-correct`, ev.target.value);
    });

document.querySelector("#card_type").addEventListener("change", updateCardType);

function updateCardType() {
    let dropdown = document.querySelector("#card_type");
    gameOptions.cardType = dropdown[dropdown.selectedIndex].id;
    document
        .querySelector("#unsaved_changes")
        .style.setProperty("display", "block");
}

document
    .querySelector("#board_size")
    .addEventListener("change", updateBoardSize);

function updateBoardSize() {
    let dropdown = document.querySelector("#board_size");
    gameOptions.boardSize = dropdown[dropdown.selectedIndex].value;
    document
        .querySelector("#unsaved_changes")
        .style.setProperty("display", "block");
}

document.querySelector("#log_out").addEventListener("click", log_out);

function log_out(ev) {
    ev.preventDefault();
    localStorage.removeItem("JWT");
    window.location.href = frontend_url + "/login.html";
}

// Start default game
getUserPreferences();
gameHandler();
updateCardType();
updateBoardSize();
