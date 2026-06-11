import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPassword2Component } from './confirm-password2.component';

describe('ConfirmPassword2Component', () => {
  let component: ConfirmPassword2Component;
  let fixture: ComponentFixture<ConfirmPassword2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPassword2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPassword2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
