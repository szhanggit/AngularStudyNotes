import { TestBed } from '@angular/core/testing';

import { ProductDtoService } from './product-dto.service';
import { ProductDTO } from 'src/app/shared/models/product-dto.model';
import { Product } from 'src/app/shared/models/product.model';

describe('ProductDtoService', () => {
  let service: ProductDtoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDtoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fromDtoToModel', () => {
    it('should transform DTO to Model', () => {
      // arrange
      const mockDto: ProductDTO[] = [{
        productId: 1,
        productType: 1,
        productCode: 'testProduct',
        productName: 'testProduct',
        productVersionId: 1,
        remainingQty: 10,
        voucherQty: 5,
        faceValue: 100,
        soldPrice: 90,
        reservationCode: '12345',
        exchangeTime: '2021-01-01',
        expiryDateSchemeId: 1,
        expiryDateScheme: 'FixEndOfDay',
        expiryDate: '2021-01-01',
        clientOrderNo: '12345'
      }];

      const expectedModel: Product[] = [{
        id: 1,
        productType: 1,
        productCode: 'testProduct',
        productName: 'testProduct',
        productVersionId: 1,
        remainingQuantity: 10,
        voucherQuantity: 5,
        faceValue: 100,
        dfvPercentage: 50,
        sellingPrice: 90,
        reservationCode: '12345',
        exchangeTime: '2021-01-01',
        expiryScheme: 1,
        expirySchemeText: 'FixEndOfDay',
        expiryDate: '2021-01-01',
        clientOrderNumber: '12345',
        isChildProduct: false,
        emailQuantity: undefined,
        smsQuantity: undefined,
        dfvQuantity: undefined,
        needTrustAccount: undefined,
        trustAccount: { 
          isTrustAccountNeeded: undefined, 
          trustAccount: undefined, 
          trustAccountFee: undefined, 
          trustAccountBatchNumber: undefined, 
          trustAccountOption: 'Default' || undefined, 
          trustAmount: undefined, 
          trustExpiryScheme: undefined, 
          trustExpiryDate: undefined,
          trustExpiryDateType: undefined
        },
        isMaster: false || undefined
      }];

      // act
      const result = service.fromDtoToModel(mockDto);

      // assert
      expect(result).toEqual(expectedModel);
    });
  });

  describe('fromModelToDto', () => {
    it('should transform Model to DTO', () => {
      // arrange
      const mockModel: Product[] = [{
        id: 1,
        productType: 1,
        productCode: 'testProduct',
        productName: 'testProduct',
        productVersionId: 1,
        remainingQuantity: 10,
        voucherQuantity: 5,
        faceValue: 100,
        sellingPrice: 90,
        reservationCode: '12345',
        exchangeTime: '2021-01-01',
        expiryScheme: 1,
        expirySchemeText: 'FixEndOfDay',
        expiryDate: '2021-01-01',
        clientOrderNumber: '12345',
        isChildProduct: false,
      }];

      const expectedDto: ProductDTO[] = [{
        productId: 1,
        productType: 1,
        productCode: 'testProduct',
        productName: 'testProduct',
        productVersionId: 1,
        remainingQty: 10,
        voucherQty: 5,
        faceValue: 100,
        soldPrice: 90,
        reservationCode: '12345',
        exchangeTime: '2021-01-01',
        expiryDateSchemeId: 1,
        expiryDateScheme: 'FixEndOfDay',
        expiryDate: '2021-01-01',
        clientOrderNo: '12345',
        emailQty: undefined,
        smsQty: undefined,
        faceValueList: undefined
      }];

      // act
      const result = service.fromModelToDto(mockModel);

      // assert
      expect(result).toEqual(expectedDto);
    });
  });
});
