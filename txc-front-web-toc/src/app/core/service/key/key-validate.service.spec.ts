import { TestBed } from '@angular/core/testing';

import { KeyValidateService } from './key-validate.service';

describe('KeyValidateService', () => {
  let service: KeyValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyValidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
