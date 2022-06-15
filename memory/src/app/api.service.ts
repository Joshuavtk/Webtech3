import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  getDogPictures(imageCount: Int16Array) {
    return fetch(`https://dog.ceo/api/breeds/image/random/${imageCount}`)
      .then((data) => data.json())
      .then((data) => data.message);
  }

  getRandomPicture() {
    return fetch("https://picsum.photos/200").then((response) => response.url);
  }
}
