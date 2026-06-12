import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DeliveryService } from './delivery.service';

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getters', () => {
    it('should be defined', () => {
      // act
      const actualDeliveryDetailList = service.deliveryDetailsList$;
      const actualTotal = service.total$;
      const actualLoading = service.loading$;
      const actualPage = service.page;
      const actualPageSize = service.pageSize;
      const acualSearchTerm = service.searchTerm;

      // assert
      expect(actualDeliveryDetailList).toBeDefined();
      expect(actualTotal).toBeDefined();
      expect(actualLoading).toBeDefined();
      expect(actualPage).toBeDefined();
      expect(actualPageSize).toBeDefined();
      expect(acualSearchTerm).toBeDefined();
    });
  });

  describe('setters', () => {
    it('should call set', () => {
      // arrange
      const setSpy = spyOn(service as any, 'set');

      // act
      service.page = 1;
      service.pageSize = 20;
      service.searchTerm = 'test';

      // assert
      expect(setSpy).toHaveBeenCalledTimes(3);
    });

    it('should set the next search pipe', () => {
      // arrange
      const searchNextSpy = spyOn((service as any)._search$, 'next');

      // act
      service.page = 1;
      service.pageSize = 20;
      service.searchTerm = 'test';

      // assert
      expect(searchNextSpy).toHaveBeenCalledTimes(3);
    });
  });
  
});
