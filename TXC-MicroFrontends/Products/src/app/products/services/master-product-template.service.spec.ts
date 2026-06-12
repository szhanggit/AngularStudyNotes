import { TestBed } from '@angular/core/testing';

import { MasterProductTemplateService } from './master-product-template.service';

describe('MasterProductTemplateService', () => {
  let service: MasterProductTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterProductTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
