import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const mockResponse = {
    inventorySKUBatches: {
      items: [{ id: 1, reservationCode: 'ABCD' }],
    },
  };

  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(InventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExpirationPolicies should call http post', () => {
    // arrange
    httpSpy.post.and.returnValue(
      of({
        data: JSON.stringify(mockResponse),
        message: null,
        success: true,
      })
    );

    // act
    service.getReservationCode([1]).subscribe((actualReservationCodes) => {
      // assert
      expect(actualReservationCodes).toEqual(
        mockResponse.inventorySKUBatches.items
      );
    });

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });
});
