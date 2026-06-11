import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SelectOrderTypeComponent } from './select-order-type.component';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';

describe('SelectOrderTypeComponent', () => {
  const quotationSvcSpy = jasmine.createSpyObj('QuotationService', [
    'getQuotations',
    'setSelectedQuotationState',
  ]);
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['dismissAll']);
  const activeModalSvcSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);

  let component: SelectOrderTypeComponent;
  let fixture: ComponentFixture<SelectOrderTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectOrderTypeComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSvcSpy },
        {
          provide: QuotationStateService,
          useValue: quotationSvcSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOrderTypeComponent);
    component = fixture.componentInstance;
    component.selectedQuotation = { quotationNumber: '0' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(quotationSvcSpy.setSelectedQuotationState).toHaveBeenCalled();
  });

  it('onModalCancel should dismissAll modal instances', () => {
    // act
    component.onModalCancel();

    // assert
    expect(modalSvcSpy.dismissAll).toHaveBeenCalled();
  });

  it('onModalCreate should close active modal with quotation type', () => {
    // arrange
    const expectedType = { key: 1, value: 'test' };
    component.selectedMode = expectedType;
    // act
    component.onModalCreate();

    // assert
    expect(activeModalSvcSpy.close).toHaveBeenCalledWith(expectedType);
  });

  it('selectType should update selected type', () => {
    // arrange
    const expectedType = { key: 1, value: 'test' };

    // act
    component.selectMode(expectedType);

    // assert
    expect(component.selectedMode).toBe(expectedType);
  });
});
