import { TestBed } from '@angular/core/testing';

import { CheckUserPermissionService } from './check-user-permission.service';

describe('CheckUserPermissionService', () => {
  let service: CheckUserPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckUserPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
