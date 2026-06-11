import { TestBed } from '@angular/core/testing';

import { EventStateService } from './event-state.service';
import { take } from 'rxjs';

describe('EventStateService', () => {
  let service: EventStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the correct value for batchListLoading$ when batchListLoading is set', () => {
    service.batchListLoading = true;
    service.batchListLoading$.pipe(take(1)).subscribe((value) => {
      expect(value).toBeTrue();
    });
  });

  it('should emit the correct value for isUploadSuccess$ when isUploadSuccess is set', () => {
    service.isUploadSuccess = { isSuccess: true };
    service.isUploadSuccess$.pipe(take(1)).subscribe((value) => {
      expect(value).toBeTrue();
    });
  });

  it('should emit the correct value for commonErrorMessage$ when commonErrorMessage is set', () => {
    const expected = 'test message';
    service.commonErrorMessage = expected;
    service.commonErrorMessage$.pipe(take(1)).subscribe((value) => {
      expect(value).toEqual(expected);
    });
  });
});
