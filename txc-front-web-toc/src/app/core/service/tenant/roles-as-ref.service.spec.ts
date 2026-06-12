import { TestBed } from '@angular/core/testing';

import { RolesAsRefService } from './roles-as-ref.service';

describe('RolesAsRefService', () => {
  let service: RolesAsRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesAsRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
