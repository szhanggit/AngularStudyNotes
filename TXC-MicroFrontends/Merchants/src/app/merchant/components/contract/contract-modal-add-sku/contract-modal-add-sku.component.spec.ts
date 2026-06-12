import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractModalAddSkuComponent } from './contract-modal-add-sku.component';

describe('ContractModalAddSkuComponent', () => {
  let component: ContractModalAddSkuComponent;
  let fixture: ComponentFixture<ContractModalAddSkuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractModalAddSkuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractModalAddSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
