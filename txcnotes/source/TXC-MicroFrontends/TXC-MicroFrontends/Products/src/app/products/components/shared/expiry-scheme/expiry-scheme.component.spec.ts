import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirySchemeComponent } from './expiry-scheme.component';

describe('ExpirySchemeComponent', () => {
  let component: ExpirySchemeComponent;
  let fixture: ComponentFixture<ExpirySchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirySchemeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirySchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
