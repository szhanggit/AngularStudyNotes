import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartStatistics2Component } from './chart-statistics2.component';

describe('ChartStatistics2Component', () => {
  let component: ChartStatistics2Component;
  let fixture: ComponentFixture<ChartStatistics2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartStatistics2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartStatistics2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
