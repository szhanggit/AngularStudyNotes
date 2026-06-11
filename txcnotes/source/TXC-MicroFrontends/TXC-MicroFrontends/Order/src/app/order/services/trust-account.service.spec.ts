import { TestBed } from '@angular/core/testing';

import { TrustAccountService } from './trust-account.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('TrustAccountService', () => {
  let service: TrustAccountService;
  let httpPostSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TrustAccountService);
    httpPostSpy = spyOn(TestBed.inject(HttpClient), 'post');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTrustAccount()', () => {
    it('should call http post', () => {
      // arrange
      const MockTrustAccountData = {
        orderLineTrustAccount: {
          items: [
            {
              amount: 111,
              createdDateTime: 'string',
              expiryDate: 'string',
              expiryPolicyId: 111,
              id: 1,
              orderLineId: 1,
              trustAccountBatchNo: 'string',
              trustAccountId: 1,
              trustAccountOption: 1,
              validFrom: 'string',
              validTo: 'string',
            },
          ],
        },
      };
      httpPostSpy.and.returnValue(
        of({
          data: JSON.stringify(MockTrustAccountData),
          success: true,
        })
      );
      // act
      service.getTrustAccount(1).subscribe((actualtrustAccount) => {
        // assert
        expect(actualtrustAccount).toEqual(
          MockTrustAccountData.orderLineTrustAccount.items[0]
        );
      });
      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });
});
