import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordReset2Component } from './password-reset2.component';

describe('PasswordReset2Component', () => {
  let component: PasswordReset2Component;
  let fixture: ComponentFixture<PasswordReset2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordReset2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordReset2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
