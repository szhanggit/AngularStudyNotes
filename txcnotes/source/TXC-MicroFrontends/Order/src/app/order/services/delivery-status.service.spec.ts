import { TestBed } from '@angular/core/testing';
import { DeliveryStatusService } from './delivery-status.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DeliveryStatusService: ', () => {
  let service: DeliveryStatusService;
  let httpPostSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryStatusService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DeliveryStatusService);
    httpPostSpy = spyOn(TestBed.inject(HttpClient), 'post');
  });

  describe('Order Distribution Status History API Call', () => {
    it('getOrderDistributionStatusHistory should call http post', () => {
      // arrange
      const MockHistoryData = {
        orderDistributionStatusHistory: {
          items: [
            {
              actionTime: '2023/01/09 09:17 AM',
              actionType: 'SyncEmail',
              actionResult: 'Success',
              operator: 'Miller',
            },
          ],
        },
      };
      httpPostSpy.and.returnValue(
        of({
          data: JSON.stringify(MockHistoryData),
          success: true,
        })
      );
      // act
      service
        .getOrderDistributionStatusHistory(1, 1)
        .subscribe((actualResponse) => {
          // assert
          expect(actualResponse).toEqual([
            MockHistoryData.orderDistributionStatusHistory.items[0],
          ]);
        });
      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });

  describe('SyncOrderDistributionStatus api', () => {
    it('should call httpPost ', () => {
      // arrange
      const requestBody = {
        orderId: 1,
        actionType: 1,
        voucherIds: ['200']
      };
      // act
      service.SyncOrderDistributionStatus(requestBody);

      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });
});
