import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantContractListComponent } from './merchant-contract-list.component';

describe('MerchantContractListComponent', () => {
  let component: MerchantContractListComponent;
  let fixture: ComponentFixture<MerchantContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantContractListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
