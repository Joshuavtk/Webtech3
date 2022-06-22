import { Component, Input, OnInit } from '@angular/core';
import { PlayerData } from '../player-data';

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent implements OnInit {

  @Input() player_data: PlayerData[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
