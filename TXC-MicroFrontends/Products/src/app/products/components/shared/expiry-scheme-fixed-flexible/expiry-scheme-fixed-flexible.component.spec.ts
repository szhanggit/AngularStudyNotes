import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirySchemeFixedFlexibleComponent } from './expiry-scheme-fixed-flexible.component';

describe('ExpirySchemeFixedFlexibleComponent', () => {
  let component: ExpirySchemeFixedFlexibleComponent;
  let fixture: ComponentFixture<ExpirySchemeFixedFlexibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirySchemeFixedFlexibleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirySchemeFixedFlexibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
