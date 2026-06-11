import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { MediaService } from './media.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MediaService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMediaById should call http post', () => {
    // act
    service.getMediaById(100);

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });

  it('getMediaByIdList should call http post', () => {
    // act
    service.getMediaByIdList([100]);

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });

  it('getMediaByKeyword should call http post', () => {
    // act
    service.getMediaByKeyword('test');

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });

  it('getImagesBySearchTerm should call http post', () => {
    // act
    service.getImagesBySearchTerm('test');

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });
});
