import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchComponent } from './image-search.component';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StandardCasePipe } from '../../pipes/standard-case.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InputModel } from '../../models/dumb-models/input.model';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MediaService } from 'src/app/order/services/media.service';
import { of } from 'rxjs';

describe('ImageSearchComponent', () => {
  const mediaSvcSpy = jasmine.createSpyObj('MediaService', ['getMediaById', 'getMediaByKeyword']);
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };

  let component: ImageSearchComponent;
  let fixture: ComponentFixture<ImageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageSearchComponent, StandardCasePipe],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        NgbTypeaheadModule,
      ],
      providers: [
        StandardCasePipe,
        { provide: MediaService, useValue: mediaSvcSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ImageSearchComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    mediaSvcSpy.getMediaById.and.returnValue(
      of({ data: '{"mediaById": [{"id": 0}]}' })
    );

    mediaSvcSpy.getMediaByKeyword.and.returnValue(
      of({ data: '{"mediaByKeyword": [{"keyword": "test"}, {"keyword": "abc"}]}' })
    );
    fixture = TestBed.createComponent(ImageSearchComponent);
    component = fixture.componentInstance;
    component.imageSearchModel = {
      label: 'test',
    } as InputModel;
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

  describe('mediaFormatter ()', () => {
    it('should for media', () => {
      // arrange
      const media = { nodeUrl: 'path' } as any;

      // act
      const result = component.mediaFormatter(media);

      // assert
      expect(result).toBe('path');
    });
  });

  describe('writeValue()', () => {
    it('should set the current value', () => {
      // act
      component.writeValue(1);

      // assert
      expect(component.value).toBe(1);
    });
  });

  describe('onSelectMediaImage()', () => {
    it('should call on change', () => {
      // arrange
      const onChangedSpy = spyOn(component, 'onChange');

      // act
      component.onSelectMediaImage({ item: { mediaId: 0 } });

      // assert
      expect(onChangedSpy).toHaveBeenCalled();
    });
  });

  describe('removeMedia()', () => {
    it('should call on change and reset value', () => {
      // arrange
      const onChangedSpy = spyOn(component, 'onChange');

      // act
      component.removeMedia();

      // assert
      expect(component.value).toBeFalsy();
      expect(onChangedSpy).toHaveBeenCalled();
    });
  });

  describe('checkMediaImageValue()', () => {
  
    it('should return exact match', () => {
      // arrange
      component.value = 'test';

      // act
      component.checkMediaImageValue();

      // assert
      expect(component.value).toEqual({keyword: 'test'} as any);
    });

    it('should set value to empty if no exact match', () => {
      // arrange
      component.value = 'test2';

      // act
      component.checkMediaImageValue();

      // assert
      expect(component.value).toBeFalsy();
    });
  
  });
  

  describe('searchMediaImages', () => {
    it('should return empty array when no match', () => {
      // act
      const result = component.searchMediaImages(of('string'));

      // assert
      result.subscribe((res) => {
        expect(res).toEqual([]);
      });
    });

    it('should return arrays of match', () => {
      // act
      const result = component.searchMediaImages(of('test'));

      // assert
      result.subscribe((res) => {
        expect(res.length).toEqual(1);
      });
    });

    it('should return nothing when empty string', () => {
      // act
      const result = component.searchMediaImages(of(''));

      // assert
      result.subscribe((res) => {
        expect(res.length).toEqual(0);
      });
    });
  });
});
