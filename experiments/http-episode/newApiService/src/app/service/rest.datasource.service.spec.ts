import { TestBed } from '@angular/core/testing';

import { RestDatasourceService } from './rest.datasource.service';

describe('RestDatasourceService', () => {
  let service: RestDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
