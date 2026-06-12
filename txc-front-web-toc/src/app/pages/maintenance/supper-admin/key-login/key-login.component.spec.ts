import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyLoginComponent } from './key-login.component';

describe('KeyLoginComponent', () => {
  let component: KeyLoginComponent;
  let fixture: ComponentFixture<KeyLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
