import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexibleExpiryModalComponent } from './flexible-expiry-modal.component';

describe('FlexibleExpiryModalComponent', () => {
  let component: FlexibleExpiryModalComponent;
  let fixture: ComponentFixture<FlexibleExpiryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexibleExpiryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlexibleExpiryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
