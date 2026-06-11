import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirySchemeFixedComponent } from './expiry-scheme-fixed.component';

describe('ExpirySchemeFixedComponent', () => {
  let component: ExpirySchemeFixedComponent;
  let fixture: ComponentFixture<ExpirySchemeFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirySchemeFixedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirySchemeFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
