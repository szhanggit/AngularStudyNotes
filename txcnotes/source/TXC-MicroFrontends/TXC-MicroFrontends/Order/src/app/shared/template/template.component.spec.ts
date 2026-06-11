import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateComponent } from './template.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MediaService } from 'src/app/order/services/media.service';
import { TagTypeEnum, TemplateTypeEnum } from '../enums/template.enum';

describe('TemplateComponent', () => {
  const mediaSvcSpy = jasmine.createSpyObj('MediaService', [
    'getMediaById',
    'getMediaByKeyword',
  ]);

  let component: TemplateComponent;
  let fixture: ComponentFixture<TemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateComponent],
      imports: [HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        { provide: MediaService, useValue: mediaSvcSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    mediaSvcSpy.getMediaById.and.returnValue(
      of({
        data: '{"mediaById": [{"id": 0, "nodeUrl": "path2"}]}',
        success: true,
      })
    );

    fixture = TestBed.createComponent(TemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyTagValues()', () => {
    it('should call replace tags', () => {
      // arrange
      component.activeTab = TemplateTypeEnum.Email;
      component.emailTemplate = {
        subject1: 'PRODUCT_NAME',
        subject2: 'PRODUCT_NAME',
        subject3: 'PRODUCT_NAME',
        content1: 'PRODUCT_NAME MERCHANTLOGO EMAIL_GREETINGS VOUCHER_IMAGE',
        content2: 'PRODUCT_NAME MERCHANTLOGO EMAIL_GREETINGS VOUCHER_IMAGE',
        content3: 'PRODUCT_NAME MERCHANTLOGO EMAIL_GREETINGS VOUCHER_IMAGE',
        templateTags: [
          { tagId: 1, type: TagTypeEnum.Text, tagName: 'PRODUCT_NAME' },
          { tagId: 2, type: TagTypeEnum.Image, tagName: 'MERCHANTLOGO' },
          { tagId: 3, type: TagTypeEnum.HTMLText, tagName: 'EMAIL_GREETINGS' },
          { tagId: 4, type: TagTypeEnum.Image, tagName: 'VOUCHER_IMAGE' },
          {
            tagId: 5,
            type: TagTypeEnum.RadioGroup,
            tagName: 'CSURL',
            options: [
              { value: 1, label: 'test', htmlValue: '<div>example</div>' },
            ],
          },
        ],
        templateTagValue: [
          { tagId: 1, value: 'productValue' },
          { tagId: 2, value: 2 },
          { tagId: 3, value: null },
          { tagId: 4, value: { nodeUrl: 'path' } },
          { tagId: 5, value: 1 },
        ],
      } as any;

      // act
      component.applyTagValues();

      // assert
      expect(mediaSvcSpy.getMediaById).toHaveBeenCalled();
      expect(component.emailTemplate.subject1).toBe('productValue');
      expect(component.emailTemplate.subject2).toBe('productValue');
      expect(component.emailTemplate.subject3).toBe('productValue');
      expect(component.emailTemplate.content1).toBe(
        'productValue path2 EMAIL_GREETINGS path'
      );
      expect(component.emailTemplate.content2).toBe(
        'productValue path2 EMAIL_GREETINGS path'
      );
      expect(component.emailTemplate.content3).toBe(
        'productValue path2 EMAIL_GREETINGS path'
      );
    });

    it('should call replace tags and set it to empty', () => {
      // arrange
      component.activeTab = TemplateTypeEnum.Email;
      component.emailTemplate = {
        templateTags: [
          { tagId: 1, type: TagTypeEnum.Text, tagName: 'PRODUCT_NAME' },
          { tagId: 2, type: TagTypeEnum.Image, tagName: 'MERCHANTLOGO' },
          { tagId: 3, type: TagTypeEnum.HTMLText, tagName: 'EMAIL_GREETINGS' },
          { tagId: 4, type: TagTypeEnum.Image, tagName: 'VOUCHER_IMAGE' },
          {
            tagId: 5,
            type: TagTypeEnum.RadioGroup,
            tagName: 'CSURL',
            options: [
              { value: 1, label: 'test', htmlValue: '<div>example</div>' },
            ],
          },
        ],
        templateTagValue: [
          { tagId: 1, value: 'productValue' },
          { tagId: 2, value: 2 },
          { tagId: 3, value: null },
          { tagId: 4, value: { nodeUrl: 'path' } },
          { tagId: 5, value: 1 },
        ],
      } as any;

      // act
      component.applyTagValues();

      // assert
      expect(mediaSvcSpy.getMediaById).toHaveBeenCalled();
      expect(component.emailTemplate.subject1).toBe('');
      expect(component.emailTemplate.subject2).toBe('');
      expect(component.emailTemplate.subject3).toBe('');
      expect(component.emailTemplate.content1).toBe('');
      expect(component.emailTemplate.content2).toBe('');
      expect(component.emailTemplate.content3).toBe('');
    });
  });

  describe('sanitizeTemplate()', () => {
    it('should call sanitizer.bypassSecurityTrustHtml', () => {
      // arrange
      const sanitizerSpy = spyOn(
        (component as any).sanitizer,
        'bypassSecurityTrustHtml'
      );

      // act
      component.sanitizeTemplate('');

      // assert
      expect(sanitizerSpy).toHaveBeenCalled();
    });
  });

  describe('onTabChange()', () => {
    it('should set active tab to email', () => {
      // act
      component.onTabChange(TemplateTypeEnum.Email);

      // assert
      expect(component.activeTab).toEqual(TemplateTypeEnum.Email);
    });

    it('should set active tab to sms', () => {
      // act
      component.onTabChange(TemplateTypeEnum.SMS);

      // assert
      expect(component.activeTab).toEqual(TemplateTypeEnum.SMS);
    });
  });
});
