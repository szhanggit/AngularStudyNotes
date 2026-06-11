import { TestBed } from '@angular/core/testing';
import { DownloadAndSendService } from './download-and-send.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DownloadAndSendService', () => {
  let service: DownloadAndSendService;
  let httpPostSpy: jasmine.Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DownloadAndSendService);
    httpPostSpy = spyOn(TestBed.inject(HttpClient), 'post');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Download voucher excel file', () => {
    it('DownloadOrderVoucherExcel should call http post', () => {
      // act
      service.DownloadOrderVoucherExcel({
        orderId: 9,
        orderMode: 1,
      });
      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });

  describe('Send client email', () => {
    it('getClientContact should call http post', () => {
      // arrange
      const MockClientEmailData = {
        clientContact: {
          items: [
            {
              clientId: 123,
              email: 'abc@gmail.com',
              name: 'abc',
            },
          ],
        },
      };
      httpPostSpy.and.returnValue(
        of({
          data: JSON.stringify(MockClientEmailData),
          success: true,
        })
      );
      // act
      service.getClientContact().subscribe((actualList) => {
        // assert
        expect(actualList).toEqual([
          MockClientEmailData.clientContact.items[0],
        ]);
      });
      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });

    it('SendOrderVoucherExcel should call http post', () => {
      // act
      service.SendOrderVoucherExcel({
        email: 'abc@getMaxListeners.com',
        orderId: 9,
      });
      // assert
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });
});
