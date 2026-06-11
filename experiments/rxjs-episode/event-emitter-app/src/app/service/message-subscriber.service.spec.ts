import { TestBed } from '@angular/core/testing';

import { MessageSubscriberService } from './message-subscriber.service';

describe('MessageSubscriberService', () => {
  let service: MessageSubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
