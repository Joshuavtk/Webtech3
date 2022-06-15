import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root'
})
export class ApiboardService {
  constructor(
    private api: ApiService, 
    private board: BoardService
  ) { }

  createPicsumBoard() {
    let cardValues : Array<Object> = [];
    for (let index = 0; index < cardNum / 2; index++) {
      getRandomValue(cardValues, this.api.getRandomPicture).then((cardValue) => {
          cardValues.push([cardValue, index]);
          if (cardValues.length == cardNum / 2) {
              this.board.createCardBlocks(cardValues);
          }
      });
    }
  }

  createRedditBoard() {
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

            this.board.createCardBlocks(pictures);
        });
  }

  createDogCeoBoard() {
    let cardValues : Array<Object> = [];
    this.api.getDogPictures(cardNum / 2).then((data) => {
        data.forEach((cardValue, index) => cardValues.push([cardValue, index]));
        this.board.createCardBlocks(cardValues);
    });
  }
}
