import { TestBed } from '@angular/core/testing';

import { AgGridColFitToSizeService } from './ag-grid-col-fit-to-size.service';

describe('AgGridColFitToSizeService', () => {
  let service: AgGridColFitToSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgGridColFitToSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
