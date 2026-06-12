import { TestBed } from '@angular/core/testing';

import { AuthorizationLibraryService } from './authorization-library.service';

describe('AuthorizationLibraryService', () => {
  let service: AuthorizationLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
