import { TestBed } from '@angular/core/testing';

import { ClientPermissionService } from './client-permission.service';

describe('ClientPermissionService', () => {
  let service: ClientPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
