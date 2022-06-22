import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPieChartComponent } from './api-pie-chart.component';

describe('ApiPieChartComponent', () => {
  let component: ApiPieChartComponent;
  let fixture: ComponentFixture<ApiPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPieChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
