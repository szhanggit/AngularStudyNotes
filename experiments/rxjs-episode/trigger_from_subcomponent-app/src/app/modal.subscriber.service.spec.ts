import { TestBed } from '@angular/core/testing';

import { ModalSubscriberService } from './modal.subscriber.service';

describe('ModalSubscriberService', () => {
  let service: ModalSubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalSubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
