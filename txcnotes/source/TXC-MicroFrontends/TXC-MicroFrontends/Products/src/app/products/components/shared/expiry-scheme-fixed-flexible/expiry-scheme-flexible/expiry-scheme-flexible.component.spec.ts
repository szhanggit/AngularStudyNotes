import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirySchemeFlexibleComponent } from './expiry-scheme-flexible.component';

describe('ExpirySchemeFlexibleComponent', () => {
  let component: ExpirySchemeFlexibleComponent;
  let fixture: ComponentFixture<ExpirySchemeFlexibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirySchemeFlexibleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirySchemeFlexibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
