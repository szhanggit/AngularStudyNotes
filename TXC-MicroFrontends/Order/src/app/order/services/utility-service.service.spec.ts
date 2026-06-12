import { TestBed } from '@angular/core/testing';

import { UtilityServiceService } from './utility-service.service';
import { Product } from 'src/app/shared/models/product.model';

describe('UtilityServiceService', () => {
  let service: UtilityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isEqual', () => {
    it('should return true if two products are equal', () => {
      const productsA =[ 
        {productCode: 'PROD001', productName: 'Product A' },
        { productCode: 'PROD002', productName: 'Product B' }
      ] as Product[];
      const productsB = [
        { productCode: 'PROD001', productName: 'Product A' },
        { productCode: 'PROD002', productName: 'Product B' }
      ] as Product[];
      const result = (service as any).isEqual(productsA, productsB);
      expect(result).toBe(true);
    });

    it('should return false if any field is different', () => {
      const productsA =[ 
        {productCode: 'PROD001', productName: 'Product A' },
        { productCode: 'PROD002', productName: 'Product B' }
      ] as Product[];
      const productsB = [
        {productCode: 'PROD001', productName: 'Product A' },
        { productCode: 'PROD003', productName: 'Product B' }
      ] as Product[];
      const result = (service as any).isEqual(productsA, productsB);
      expect(result).toBe(false);
    });

    it('should return false if products length is different', () => {
      const productsA =[ 
        {productCode: 'PROD001', productName: 'Product A' },
        { productCode: 'PROD002', productName: 'Product B' }
      ] as Product[];
      const productsB = [
        { productCode: 'PROD001', productName: 'Product A' }
      ] as Product[];
      const result = (service as any).isEqual(productsA, productsB);
      expect(result).toBe(false);
    });
  });
});
