import { TestBed } from '@angular/core/testing';

import { PageAuthorizationGuard } from './page-authorization.guard';

describe('PageAuthorizationGuard', () => {
  let guard: PageAuthorizationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PageAuthorizationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
