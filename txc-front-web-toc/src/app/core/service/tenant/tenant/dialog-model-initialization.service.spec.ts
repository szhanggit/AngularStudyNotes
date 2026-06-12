import { TestBed } from '@angular/core/testing';

import { DialogModelInitializationService } from './dialog-model-initialization.service';

describe('DialogModelInitializationService', () => {
  let service: DialogModelInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogModelInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
