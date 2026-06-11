import { TestBed } from '@angular/core/testing';

import { SketchFileToBase64Service } from './sketch-file-to-base64.service';

describe('SketchFileToBase64Service', () => {
  let service: SketchFileToBase64Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SketchFileToBase64Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
