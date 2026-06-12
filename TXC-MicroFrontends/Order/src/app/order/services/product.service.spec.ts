import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
  });

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('getProductsListByQuotationId()', () => {
    it('should return mock reference', () => {
      // act
      const actualProductList = service.getProductsListByQuotationId(1);

      // assert
      expect(actualProductList).toBeTruthy();
    });
  });

  describe('getTrustAccountList()', () => {
    it('should return mock trust account list', () => {
      // act
      const actualTrustAccountList = service.getTrustAccountList();

      // assert
      expect(actualTrustAccountList).toBeTruthy();
    });
  });

  describe('getExpirySchemeData()', () => {
    it('should return mock expiry scheme data', () => {
      // act
      const actualExpirySchemeData = service.getExpirySchemeData();

      // assert
      expect(actualExpirySchemeData).toBeTruthy();
    });
  });

  describe('getEmailTemplateListData()', () => {
    it('should return mock template list data', () => {
      // act
      const actualTemplateListData = service.getEmailTemplateListData();

      // assert
      expect(actualTemplateListData).toBeTruthy();
    });
  });
});
