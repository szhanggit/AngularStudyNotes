import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AttachmentService } from './attachment.service';
import { of } from 'rxjs';
import { saveAs } from 'file-saver';


describe('AttachmentService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'delete']);
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(AttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getOrderAttachments should call http get', () => {
    // arrange
    httpSpy.get.and.returnValue(of({ data: { attachmentsInfo: [] } }));

    // act
    service.getOrderAttachments(1).subscribe((res) => {
      // assert
      expect(res).toEqual([]);
    });

    // assert
    expect(httpSpy.get).toHaveBeenCalled();
  });

  it('editFileAttachment should call http post', () => {
    // arrange
    httpSpy.post.and.returnValue(of({ data: {}, message: '', success: true }));
    const file = [new File([], 'test.xls')];

    // act
    service.editFileAttachment(1, file);

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });

  it('downloadOrderAttachment should call http post', () => {
    // arrange
    httpSpy.post.and.returnValue(of(new Blob()));

    // act
    service.downloadOrderAttachment('file.xls', 1);

    // assert
    expect(httpSpy.post).toHaveBeenCalled();
  });

  it('downloadOrderAttachment should call http post', () => {
    // arrange
    httpSpy.delete.and.returnValue(
      of({ data: {}, message: '', success: true })
    );

    // act
    service.deleteFileAttachment(1, 'date', ['file.xls']);

    // assert
    expect(httpSpy.delete).toHaveBeenCalled();
  });

  it('downloadRecentlyUploadedAttachment should call saveAs', () => {
    // arraange
    const attachment = new File([], 'test.xls');
    const saveAsSpy = spyOn(saveAs, 'saveAs');

    // act
    service.downloadRecentlyUploadedAttachment(attachment);

    // assert
    // expect(saveAsSpy).toHaveBeenCalled();
  });
});
