import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { QuotationService } from './quotation.service';
import { environment } from 'src/environments/environment';

describe('QuotationService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

  let service: QuotationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationService, { provide: HttpClient, useValue: httpSpy }],
    });

    service = TestBed.inject(QuotationService);
  });

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('getQuotations()', () => {
    it('should call http get', () => {
      // arrange
      const expectedUrl = `http://${environment.apiUrl}api/Quotation/SignedQuotations`;

      // act
      service.getQuotations();

      // assert
      expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http get and add keyword', () => {
      // arrange
      const expectedUrl = `http://${environment.apiUrl}api/Quotation/SignedQuotations?Keyword=test`;

      // act
      service.getQuotations({ keyword: 'test' });

      // assert
      expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http get and add status', () => {
      // arrange
      const expectedUrl = `http://${environment.apiUrl}api/Quotation/SignedQuotations?Status=1`;

      // act
      service.getQuotations({ status: 1 });

      // assert
      expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http get and add client code', () => {
      // arrange
      const expectedUrl = `http://${environment.apiUrl}api/Quotation/SignedQuotations?ClientCode=100`;

      // act
      service.getQuotations({ clientCode: '100' });

      // assert
      expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http get and add validOn', () => {
      // arrange
      const expectedUrl = `http://${environment.apiUrl}api/Quotation/SignedQuotations?ValidOn=2023/12/12`;

      // act
      service.getQuotations({ validOn: '2023/12/12' });

      // assert
      expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http get and add page properties', () => {
      // arrange
      const expectedUrl = `http://${environment.apiUrl}api/Quotation/SignedQuotations?pageSize=10&pageIndex=1`;

      // act
      service.getQuotations({ pageSize: 10, pageIndex: 1 });

      // assert
      expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl);
    });
    
  });

  describe('getQuotationById()', () => {
  
    it('should call http get', () => {
      // act
      service.getQuotationById(1);

      // assert
      expect(httpSpy.get).toHaveBeenCalled();
    });
  
  });

  describe('childProductInQuotation()', () => {
  
    it('should call http get', () => {
      // act
      service.childProductInQuotation(1, []);

      // assert
      expect(httpSpy.get).toHaveBeenCalled();
    });
  
  });
  
});
