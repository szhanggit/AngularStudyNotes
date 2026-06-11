import { TestBed } from '@angular/core/testing';

import { ToastTxcService } from './toast-txc.service';

describe('ToastTxcService', () => {
  let service: ToastTxcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastTxcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
