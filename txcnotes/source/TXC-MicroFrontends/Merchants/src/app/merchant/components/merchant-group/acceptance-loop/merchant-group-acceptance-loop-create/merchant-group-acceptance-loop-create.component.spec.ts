import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupAcceptanceLoopCreateComponent } from './merchant-group-acceptance-loop-create.component';

describe('MerchantGroupAcceptanceLoopCreateComponent', () => {
  let component: MerchantGroupAcceptanceLoopCreateComponent;
  let fixture: ComponentFixture<MerchantGroupAcceptanceLoopCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupAcceptanceLoopCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupAcceptanceLoopCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
