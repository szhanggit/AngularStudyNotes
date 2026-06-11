import { TestBed } from '@angular/core/testing';

import { GridEditDeleteMainService } from './grid-edit-delete-main.service';

describe('GridEditDeleteMainService', () => {
  let service: GridEditDeleteMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridEditDeleteMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
