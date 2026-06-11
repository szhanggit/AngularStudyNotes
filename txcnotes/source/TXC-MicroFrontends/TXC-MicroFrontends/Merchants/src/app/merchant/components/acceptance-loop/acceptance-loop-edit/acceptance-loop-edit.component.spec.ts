import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopEditComponent } from './acceptance-loop-edit.component';

describe('AcceptanceLoopEditComponent', () => {
  let component: AcceptanceLoopEditComponent;
  let fixture: ComponentFixture<AcceptanceLoopEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceLoopEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
