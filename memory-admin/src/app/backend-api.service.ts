import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GameData } from './game-data';

import { JwtService } from './jwt.service';
import { PlayerData } from './player-data';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  game_data: GameData = new GameData;
  player_data: PlayerData[] = [];

  constructor(private jwt: JwtService) { }

  aggregateGames(): GameData {
    let jwt = this.jwt.getJWT()

    if (jwt) {


      fetch(environment.backend_url + "/api/admin/aggregate", {
        headers: {
          Authorization: "Bearer " + jwt,
        }
      })
        .then(data => {
          if (data.status != 200) {
            localStorage.removeItem("JWT")
            window.alert("Sessie verlopen, log opnieuw in.");
            return;
          }

          return data.json()
        })
        .then(data => {
          if (data) {

            this.game_data.total_games = data[0].aantal_spellen
            this.game_data.total_players = data[1].aantal_spelers
            this.game_data.chosen_apis = data[2]

            return this.game_data
          }
          return;
        })

    }
    return this.game_data
  }

  aggregatePlayers(): PlayerData[] {
    let jwt = this.jwt.getJWT()

    if (jwt) {

      fetch(environment.backend_url + "/api/admin/players", {
        headers: {
          Authorization: "Bearer " + jwt,
        }
      })
        .then(data => {
          if (data.status != 200) {
            return [];
          }

          return data.json()
        })
        .then((data: PlayerData[]) => {

          data.forEach((player: PlayerData) => {
            this.player_data.push(player)
          })

          return this.player_data
        })
    }
    return this.player_data
  }
}
