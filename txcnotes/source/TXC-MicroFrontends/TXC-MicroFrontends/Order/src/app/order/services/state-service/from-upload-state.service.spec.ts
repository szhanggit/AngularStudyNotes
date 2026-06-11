import { TestBed } from '@angular/core/testing';
import { FromUploadStateService } from './from-upload-state.service';

describe('FromUploadStateService', () => {
  let service: FromUploadStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FromUploadStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.fromUpload$).toBeDefined();
  });

  it('state should be defined', () => {
    // assert
    service.fromUpload$.subscribe((actualFromUpload) => {
        expect(actualFromUpload).toBeDefined();
      });
  });

  describe('setDeliveryDetailsFromUpload()', () => {
    it('should add to list', () => {
      // arrange
      service.fromUploadList = [];

      // act
      service.setDeliveryDetailsFromUpload(12, true);

      // assert
      expect(service.fromUploadList.length).toEqual(1);
    });
    it('should replace list', () => {
      // arrange
      service.fromUploadList = [
        { productId: 12, deliveryDetailsFromUpload: true },
      ];

      // act
      service.setDeliveryDetailsFromUpload(12, true);

      // assert
      expect(service.fromUploadList.length).toEqual(1);
    });
  });
});
