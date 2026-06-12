import { TestBed } from '@angular/core/testing';

import { MasterProductComboService } from './master-product-combo.service';

describe('MasterProductComboService', () => {
  let service: MasterProductComboService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterProductComboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
