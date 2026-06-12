import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopFormComponent } from './acceptance-loop-form.component';

describe('AcceptanceLoopFormComponent', () => {
  let component: AcceptanceLoopFormComponent;
  let fixture: ComponentFixture<AcceptanceLoopFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceLoopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
