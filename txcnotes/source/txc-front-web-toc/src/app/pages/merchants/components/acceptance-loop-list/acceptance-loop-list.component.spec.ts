import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopListComponent } from './acceptance-loop-list.component';

describe('AcceptanceLoopListComponent', () => {
  let component: AcceptanceLoopListComponent;
  let fixture: ComponentFixture<AcceptanceLoopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceLoopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
