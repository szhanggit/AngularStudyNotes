import { TestBed } from '@angular/core/testing';

import { ListOfUserRolesService } from './list-of-user-roles.service';

describe('ListOfUserRolesService', () => {
  let service: ListOfUserRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListOfUserRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
