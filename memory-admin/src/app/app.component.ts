import { Component } from '@angular/core';
import { JwtService } from './jwt.service';
import { BackendApiService } from './backend-api.service';
import { GameData } from './game-data';
import { PlayerData } from './player-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dashboard';
  game_data: GameData = this.backendApiService.aggregateGames();
  player_data: PlayerData[] = this.backendApiService.aggregatePlayers();

  constructor(
    public jwtService: JwtService,
    public backendApiService: BackendApiService
  ) { }

  ngOnInit() {
  }
}
