import { TestBed } from '@angular/core/testing';

import { ProductWizardService } from './product-wizard.service';

describe('ProductWizardService', () => {
  let service: ProductWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
