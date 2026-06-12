import { TestBed } from '@angular/core/testing';

import { TitleNotifierService } from './title-notifier.service';

describe('TitleNotifierService', () => {
  let service: TitleNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
