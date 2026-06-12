import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopCreateComponent } from './acceptance-loop-create.component';

describe('AcceptanceLoopCreateComponent', () => {
  let component: AcceptanceLoopCreateComponent;
  let fixture: ComponentFixture<AcceptanceLoopCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceLoopCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
