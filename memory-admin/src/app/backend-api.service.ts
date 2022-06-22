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

    fetch(environment.backend_url + "/api/admin/aggregate", {
      headers: {
        Authorization: "Bearer " + jwt,
      }
    })
      .then(data => {
        if (data.status != 200) {
          // TODO
          // window.location.href = window.location.origin + window.location.pathname + "/login.html?msg=session_expired";
        }

        return data.json()
      })
      .then(data => {
        console.log(data[2])
        this.game_data.total_games = data[0].aantal_spellen
        this.game_data.total_players = data[1].aantal_spelers
        this.game_data.chosen_apis = data[2]

        return this.game_data
      })

    return this.game_data
  }

  aggregatePlayers(): PlayerData[] {
    let jwt = this.jwt.getJWT()

    fetch(environment.backend_url + "/api/admin/players", {
      headers: {
        Authorization: "Bearer " + jwt,
      }
    })
      .then(data => {
        if (data.status != 200) {
          // TODO
          //window.location.href = window.location.origin + window.location.pathname + "/login.html?msg=session_expired";
        }

        return data.json()
      })
      .then((data: PlayerData[]) => {

        data.forEach((player: PlayerData) => {
          this.player_data.push(player)
        })

        return this.player_data
      })
    return this.player_data
  }
}
