import { TestBed } from '@angular/core/testing';

import { IdFileToBase64Service } from './id-file-to-base64.service';

describe('IdFileToBase64Service', () => {
  let service: IdFileToBase64Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdFileToBase64Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
