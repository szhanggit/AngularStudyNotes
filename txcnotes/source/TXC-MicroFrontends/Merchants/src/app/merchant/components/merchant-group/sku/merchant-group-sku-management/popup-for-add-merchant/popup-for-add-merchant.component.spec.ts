import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupForAddMerchantComponent } from './popup-for-add-merchant.component';

describe('PopupForAddMerchantComponent', () => {
  let component: PopupForAddMerchantComponent;
  let fixture: ComponentFixture<PopupForAddMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupForAddMerchantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupForAddMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
