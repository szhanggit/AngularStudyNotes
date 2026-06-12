import { TestBed } from '@angular/core/testing';

import { MasterProductApiService } from './master-product-api.service';

describe('MasterProductApiService', () => {
  let service: MasterProductApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterProductApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
