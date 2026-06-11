import { TestBed } from '@angular/core/testing';

import { BatchListService } from './batch-list.service';
import { UtilityService } from '../utility.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Merchant } from '../../models/contract-sku-details.model';
import { UploadInventoryPayload } from '../../models/upload-inventory-payload.model';
import { HttpClient } from '@angular/common/http';

describe('BatchListService', () => {
  let service: BatchListService;
  const utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['']);
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'put']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        {
          provide: UtilityService,
          useValue: utilityServiceSpy,
        },
      ],
    });
    service = TestBed.inject(BatchListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should upload inventory voucher number', () => {
    const mockPayload: UploadInventoryPayload = {
      SKUCode: 'test_sku_code',
      MerchantName: 'test_merchant',
      ExpiryDate: 'test_expiry_date',
      StartDateAvailable: 'test_start_date',
      EndDateAvailable: 'test_end_date',
      File: new File([''], 'test_file'),
    };

    httpSpy.put.and.returnValue(of({}));

    service.uploadInventoryVoucherNumber(mockPayload);

    expect(httpSpy.put).toHaveBeenCalled();
  });

  it('should get merchant by SKU code', () => {
    const mockResponse = {
      data: JSON.stringify({
        contractSKUDetails: {
          items: [
            {
              contractSKUCosts: [
                {
                  skuCostContract: {
                    merchant: 'Test Merchant',
                  },
                },
              ],
            },
          ],
        },
      }),
    };

    httpSpy.post.and.returnValue(of(mockResponse));

    service.getMerchantBySkuCode('test_sku_code').subscribe((res) => {
      expect(res.data).toBeDefined();
    });

    expect(httpSpy.post).toHaveBeenCalled();
  });
});
