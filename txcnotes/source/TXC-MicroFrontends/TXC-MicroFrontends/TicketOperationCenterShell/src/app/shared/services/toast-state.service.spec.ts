import { TestBed } from '@angular/core/testing';

import { ToastStateService } from './toast-state.service';

describe('ToastStateService', () => {
  let service: ToastStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
