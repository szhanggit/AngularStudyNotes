import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { ExpiryPolicyService } from './expiry-policy.service';

describe('ExpiryPolicyService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const mockResponse = {
    expirationPolicies: [
      { id: 42, name: 'ChildFlexibleDateDependsOnMasterExpiry' },
    ],
  };

  let service: ExpiryPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(ExpiryPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExpirationPolicies should call http post', () => {
    // arrange
    httpSpy.post.and.returnValue(
      of({
        data: JSON.stringify(mockResponse),
        message: null,
        success: true,
      })
    );

    // act
    service.getExpirationPolicies().subscribe((actualExpirationPolices) => {
      // assert
      expect(actualExpirationPolices).toEqual(mockResponse.expirationPolicies);
    });

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });
});
