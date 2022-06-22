import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ApiPieChartComponent } from './api-pie-chart/api-pie-chart.component';
import { PlayerTableComponent } from './player-table/player-table.component';

@NgModule({
  declarations: [
    AppComponent,
    ApiPieChartComponent,
    PlayerTableComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
