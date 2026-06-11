import { TestBed } from '@angular/core/testing';
import { OrderHistoryService } from './order-history.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('OrderHistoryService', () => {
  let service: OrderHistoryService;
  let httpPostSpy: jasmine.Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderHistoryService],
    });

    service = TestBed.inject(OrderHistoryService);
    httpPostSpy = spyOn(TestBed.inject(HttpClient), 'post');
  });

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('getOrderHistory()', () => {
    it('should return mock history', () => {
      // act
      const actualValue = service.getOrderHistory();

      // assert
      expect(actualValue).toEqual(service.MOCK_HISTORY);
    });
  });

  describe('Order history data', () => {
    it('getOrderActionHistories should call http post', () => {
      // arrange
      const MockHistoryData = {
        orderActionHistories: {
          items: [
            {
              result: 'Under Review',
              operator: 'user',
              createdDateTime: '2023-12-12',
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
      service.getOrderActionHistories(1).subscribe((actualHistory) => {
        // assert
        expect(actualHistory).toEqual([
          MockHistoryData.orderActionHistories.items[0],
        ]);
      });
      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });
});
