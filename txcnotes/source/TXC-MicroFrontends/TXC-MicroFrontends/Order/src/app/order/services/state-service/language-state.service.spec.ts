import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LanguageStateService } from './language-state.service';

describe('LanguageStateService', () => {
  let service: LanguageStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LanguageStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
