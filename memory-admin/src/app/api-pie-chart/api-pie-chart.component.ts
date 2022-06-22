import { Component, Input, OnInit } from '@angular/core';
import { ApiData } from '../api-data';

@Component({
  selector: 'app-api-pie-chart',
  templateUrl: './api-pie-chart.component.html',
  styleUrls: ['./api-pie-chart.component.css']
})
export class ApiPieChartComponent implements OnInit {
  @Input() api_data: ApiData[] = [];
  @Input() total_games: number = 0;
  pie_chart_degrees: number[] = [];

  ngOnInit(): void { this.calculatePieChart() }

  calculatePieChart() {
    let one_game_degree = 360 / this.total_games
    this.pie_chart_degrees.push(this.api_data[0].aantal * one_game_degree)
    this.pie_chart_degrees.push(this.api_data[1].aantal * one_game_degree + this.pie_chart_degrees[0])
  }
}
