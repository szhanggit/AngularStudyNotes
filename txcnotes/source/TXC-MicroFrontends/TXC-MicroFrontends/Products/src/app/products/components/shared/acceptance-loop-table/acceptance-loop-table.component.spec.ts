import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopTableComponent } from './acceptance-loop-table.component';

describe('AcceptanceLoopTableComponent', () => {
  let component: AcceptanceLoopTableComponent;
  let fixture: ComponentFixture<AcceptanceLoopTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceLoopTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
