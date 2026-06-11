import { TestBed } from '@angular/core/testing';

import { ProductCustomizationService } from './product-customization.service';

describe('ProductCustomizationService', () => {
  let service: ProductCustomizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCustomizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
