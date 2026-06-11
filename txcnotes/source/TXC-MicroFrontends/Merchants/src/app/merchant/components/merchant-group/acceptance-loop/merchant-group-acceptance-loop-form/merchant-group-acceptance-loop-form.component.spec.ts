import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupAcceptanceLoopFormComponent } from './merchant-group-acceptance-loop-form.component';

describe('MerchantGroupAcceptanceLoopFormComponent', () => {
  let component: MerchantGroupAcceptanceLoopFormComponent;
  let fixture: ComponentFixture<MerchantGroupAcceptanceLoopFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupAcceptanceLoopFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupAcceptanceLoopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
