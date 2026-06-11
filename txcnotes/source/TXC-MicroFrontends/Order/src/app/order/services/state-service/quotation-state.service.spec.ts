import { TestBed } from '@angular/core/testing';
import { QuotationStateService } from './quotation-state.service';
import { QuotationService } from '../quotation.service';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { INITIAL_QUOTATION_PAGINATED_STATE } from '../../interface/quotation-state.interface';
import { of } from 'rxjs';

describe('QuotationStateService', () => {
  const quotationSvcSpy = jasmine.createSpyObj('QuotationService', [
    'getQuotations',
  ]);

  let service: QuotationStateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuotationStateService,
        {
          provide: QuotationService,
          useValue: quotationSvcSpy,
        },
      ],
    });

    service = TestBed.inject(QuotationStateService);
  });

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  it('states', () => {
    // assert
    service.selectedOrderMode$.subscribe((selectedOrderType) => {
      expect(selectedOrderType).toBeDefined();
    });
    service.quotationPaginated$.subscribe((quotationPaginated) => {
      expect(quotationPaginated).toBeDefined();
    });
    service.selectedQuotation$.subscribe((selectedQuotation) => {
      expect(selectedQuotation).toBeDefined();
    });
  });

  describe('setSelectedQuotationTypeState()', () => {
    it('should call setState', () => {
      // arrange
      const setStateSpy = spyOn(service as any, 'setState');

      // act
      service.setSelectedOrderModeState({
        key: OrderModeEnum.API,
      } as any);

      // assert
      expect(setStateSpy).toHaveBeenCalledWith({
        selectedOrderMode: { key: OrderModeEnum.API },
      });
    });
  });

  describe('setSelectedQuotationState()', () => {
    it('should call setState', () => {
      // arrange
      const setStateSpy = spyOn(service as any, 'setState');

      // act
      service.setSelectedQuotationState({
        id: 1,
      } as any);

      // assert
      expect(setStateSpy).toHaveBeenCalledWith({
        selectedQuotation: { id: 1 },
      });
    });
  });

  describe('clearQuotationPaginated()', () => {
    it('should call setState', () => {
      // arrange
      const setStateSpy = spyOn(service as any, 'setState');

      // act
      service.clearQuotationPaginated();

      // assert
      expect(setStateSpy).toHaveBeenCalledWith({
        quotationPaginated: INITIAL_QUOTATION_PAGINATED_STATE,
      });
    });
  });

  describe('getQuotationPaginated()', () => {
    it('should call setState', () => {
      // arrange
      quotationSvcSpy.getQuotations.and.returnValue(of({ data: [] }));
      const setStateSpy = spyOn(service as any, 'setState');

      // act
      service.getQuotationPaginated();

      // assert
      expect(quotationSvcSpy.getQuotations).toHaveBeenCalled();
      expect(setStateSpy).toHaveBeenCalledWith({ quotationPaginated: [] });
    });
  });
});
