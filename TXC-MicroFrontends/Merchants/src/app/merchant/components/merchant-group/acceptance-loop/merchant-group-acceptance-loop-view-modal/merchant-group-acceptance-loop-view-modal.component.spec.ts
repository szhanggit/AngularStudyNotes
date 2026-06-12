import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupAcceptanceLoopViewModalComponent } from './merchant-group-acceptance-loop-view-modal.component';

describe('MerchantGroupAcceptanceLoopViewModalComponent', () => {
  let component: MerchantGroupAcceptanceLoopViewModalComponent;
  let fixture: ComponentFixture<MerchantGroupAcceptanceLoopViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupAcceptanceLoopViewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupAcceptanceLoopViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
