import { TestBed } from '@angular/core/testing';

import { StudentRepositoryService } from './student.repository.service';

describe('StudentRepositoryService', () => {
  let service: StudentRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
