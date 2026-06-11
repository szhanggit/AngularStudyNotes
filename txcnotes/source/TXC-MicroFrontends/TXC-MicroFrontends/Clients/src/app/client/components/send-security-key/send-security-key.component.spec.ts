import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSecurityKeyComponent } from './send-security-key.component';

describe('SendSecurityKeyComponent', () => {
  let component: SendSecurityKeyComponent;
  let fixture: ComponentFixture<SendSecurityKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSecurityKeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendSecurityKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
