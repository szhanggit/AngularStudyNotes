import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Account2Component } from './account2.component';

describe('Account2Component', () => {
  let component: Account2Component;
  let fixture: ComponentFixture<Account2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Account2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Account2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
