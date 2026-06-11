import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractModalEditPeriodComponent } from './contract-modal-edit-period.component';

describe('ContractModalEditPeriodComponent', () => {
  let component: ContractModalEditPeriodComponent;
  let fixture: ComponentFixture<ContractModalEditPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractModalEditPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractModalEditPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
