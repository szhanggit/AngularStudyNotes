import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupAcceptanceLoopEditComponent } from './merchant-group-acceptance-loop-edit.component';

describe('MerchantGroupAcceptanceLoopEditComponent', () => {
  let component: MerchantGroupAcceptanceLoopEditComponent;
  let fixture: ComponentFixture<MerchantGroupAcceptanceLoopEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupAcceptanceLoopEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupAcceptanceLoopEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
