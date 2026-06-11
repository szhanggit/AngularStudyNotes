import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { DictionaryService } from './dictionary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DictionaryService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  let service: DictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HttpClient,
          useValue: httpSpy,
        },
      ],
    });
    service = TestBed.inject(DictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChannels()', () => {
    it('should call http post', () => {
      // act
      service.getChannels();

      // assert
      expect(httpSpy.post).toHaveBeenCalled();
    });
  });

  describe('getLanguages()', () => {
    it('should call http post', () => {
      // arrange
      httpSpy.post.and.returnValue(
        of({ data: JSON.stringify({ dictionaries: [] }) })
      );
      // act
      service.getLanguages();

      // assert
      expect(httpSpy.post).toHaveBeenCalled();
    });
  });
});
