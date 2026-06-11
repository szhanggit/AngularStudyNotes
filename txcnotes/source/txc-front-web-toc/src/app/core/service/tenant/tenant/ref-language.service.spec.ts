import { TestBed } from '@angular/core/testing';

import { RefLanguageService } from './ref-language.service';

describe('RefLanguageService', () => {
  let service: RefLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
