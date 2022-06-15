import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor() { }

  createCardBlocks(cardValues : Array<Object>) {
    // Duplicate values in array
    cardValues.push(...cardValues);

    // Shuffle array
    cardValues = cardValues
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (let index = 0; index < cardNum; index++) {
      let card = this.createCard(cardValues[index][0], cardValues[index][1]);

      gameContainer.append(card);
    }
  }

  createCard(value : Object, index : string) {
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

  checkIfSelectedOrCorrect(selectedBlock : HTMLElement) {
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
}
