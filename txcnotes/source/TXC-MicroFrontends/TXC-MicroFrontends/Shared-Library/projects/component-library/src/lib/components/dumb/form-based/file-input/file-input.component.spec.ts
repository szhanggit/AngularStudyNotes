import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { FileEventTypeEnum } from '../../../enums/file-event-type.enum';
import { FileInputLibComponent } from './file-input.component';
import { AttachmentService, CustomFile, InputModel } from 'projects/component-library/src/public-api';


describe('FileInputLibComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: FileInputLibComponent;
  let fixture: ComponentFixture<FileInputLibComponent>;
  let attachmentService: jasmine.SpyObj<AttachmentService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileInputLibComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: AttachmentService,
          useValue: jasmine.createSpyObj('AttachmentService', [
            'downloadRecentlyUploadedAttachment',
          ]),
        },
      ],
    })
      .overrideComponent(FileInputLibComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FileInputLibComponent);
    component = fixture.componentInstance;
    component.fileInput = {
      label: 'test',
    } as InputModel;
    component.value = [];

    attachmentService = TestBed.inject(
      AttachmentService
    ) as jasmine.SpyObj<AttachmentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('controlErrors()', () => {
    it('should return []', () => {
      // assert
      expect(component.controlErrors).toEqual([]);
    });

    it('should return errors', () => {
      // act
      component.controlDir.control?.setErrors({ required: true });

      // assert
      expect(component.controlErrors).toEqual(['required']);
    });
  });

  describe('writeValue()', () => {
    it('should set the current value', () => {
      // arrange
      const file = new File([], 'test.pdf');

      // act
      component.writeValue(file);

      // assert
      expect(component.value).toBe(file);
    });
  });

  describe('onFileSelected()', () => {
    it('should set the current value', () => {
      // arrange
      const file = new File([], 'test.pdf');

      // act
      component.onFileSelected({ target: { files: [file] } });

      // assert
      expect(component.value).toEqual([file]);
    });

    it('should emit file event with api', () => {
      // arrange
      const file: CustomFile = new File([], 'test.pdf');
      component.fileInput.eventWithApi = true;
      const fileEventWithApiEmitSpy = spyOn(component.fileEventWithApi, 'emit');
      const expected = {
        customFiles: [file],
        eventType: FileEventTypeEnum.UPLOAD,
        index: undefined,
      };

      // act
      component.onFileSelected({ target: { files: [file] } });

      // assert
      expect(fileEventWithApiEmitSpy).toHaveBeenCalledWith(expected);
    });

    it('should add isRecentlyUploaded = true to file uploaded', () => {
      // arrange
      const files: CustomFile[] = [
        new File([], 'test.pdf'),
        new File([], 'test2.pdf'),
      ];

      // act
      component.mapAdditionalFileProps(files);

      // assert
      expect(
        files.every((file) => file.isRecentlyUploaded === true)
      ).toBeTrue();
    });

    it('should return files if no file is passed in mapAdditionalFileProps', () => {
      // arrange
      const files: CustomFile[] = [];

      // act
      const mappedFiles = component.mapAdditionalFileProps(files);

      // assert
      expect(mappedFiles).toEqual(files);
    });

    it('should set hasDuplicate to true if uploaded file is duplicate', () => {
      // arrange
      const files: CustomFile[] = [new File([], 'test-dup.xls')];
      component.value = [{ name: 'test-dup.xls' }];
      // act
      const mappedFiles = component.mapAdditionalFileProps(files);
      component.value.some((v: File) => v.name === files[0].name);

      // assert
      expect(
        mappedFiles.some((file: CustomFile) => file.hasDuplicate)
      ).toBeTrue();
    });

    it('should add to current value', () => {
      // arrange
      component.value = [new File([], 'test.xls')];
      const file = new File([], 'test.pdf');

      // act
      component.onFileSelected({ target: { files: [file] } });

      // assert
      expect(component.value.length).toBe(2);
    });
  });

  describe('onFileRemove()', () => {
    it('should remove file', () => {
      // arrange
      component.value = [new File([], 'test.xls'), new File([], 'test.pdf')];
      const file: CustomFile = new File([], 'test.xls');

      // act
      component.onFileRemove(0, 0, file);

      // assert
      expect(component.value.length).toBe(1);
    });
  });

  it('should emit file event with api', () => {
    // arrange
    const file: CustomFile = new File([], 'test.pdf');
    component.fileInput.eventWithApi = true;
    const fileEventWithApiEmitSpy = spyOn(component.fileEventWithApi, 'emit');
    const expected = {
      customFiles: [file],
      index: 0,
      eventType: FileEventTypeEnum.DELETE,
    };

    // act
    component.onFileRemove(0, 0, file);

    // assert
    expect(fileEventWithApiEmitSpy).toHaveBeenCalledWith(expected);
  });

  describe('onFileDropped()', () => {
    it('should remove file', () => {
      // arrange
      component.value = [];

      // act
      component.onFileDropped([new File([], 'test.xls') as CustomFile]);

      // assert
      expect(component.value.length).toBe(1);
    });
  });

  describe('onFileDownload()', () => {
    it('should not download file', () => {
      // act
      component.onFileDownload({ isRecentlyUploaded: false } as CustomFile);

      // assert
      expect(
        attachmentService.downloadRecentlyUploadedAttachment
      ).not.toHaveBeenCalled();
    });

    it('should download file', () => {
      // act
      component.onFileDownload({ isRecentlyUploaded: true } as CustomFile);

      // assert
      expect(
        attachmentService.downloadRecentlyUploadedAttachment
      ).toHaveBeenCalled();
    });
  });
});
