import { TestBed } from '@angular/core/testing';

import { FormEmitterService } from './form-emitter.service';

describe('FormEmitterService', () => {
  let service: FormEmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormEmitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
