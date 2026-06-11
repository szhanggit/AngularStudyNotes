import { TestBed } from '@angular/core/testing';

import { LdapUserService } from './ldap-user.service';

describe('LdapUserService', () => {
  let service: LdapUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LdapUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
