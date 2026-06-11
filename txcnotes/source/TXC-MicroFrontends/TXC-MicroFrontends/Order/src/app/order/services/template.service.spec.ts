import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TemplateService } from './template.service';
import {
  Template,
  TemplateVersion,
} from 'src/app/shared/models/template.model';
import {
  TagCategoryEnum,
  TagTypeEnum,
  TemplateSubTypeEnum,
  TemplateTypeEnum,
} from 'src/app/shared/enums/template.enum';
import { TemplateTag } from 'src/app/shared/models/template-tag.model';
import { LanguageStateService } from './state-service/language-state.service';

describe('TemplateService', () => {
  let service: TemplateService;
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const languageStateServiceSpy = jasmine.createSpyObj('HttpClient', [], {
    selectedLanguageList$: of([
      {
        dictionaryId: 66,
        displayName: 'Chinese',
      },
    ]),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: LanguageStateService, useValue: languageStateServiceSpy },
      ],
    });

    service = TestBed.inject(TemplateService);
  });

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('getProductTemplate()', () => {
    it('should call http get', () => {
      // act
      service.getProductTemplate(132, TemplateTypeEnum.Email);

      // assert
      expect(httpSpy.get).toHaveBeenCalled();
    });
  });

  describe('getTemplateDetails', () => {
    it('should call http post', () => {
      // arrange
      const expectedTemplateVersionInfo = {
        templateVersionInfo: { items: [] },
      };
      let actualTemplateVersionInfo: TemplateVersion[] = [];

      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedTemplateVersionInfo),
          message: null,
          success: true,
        })
      );

      // act
      service
        .getTemplateDetails(TemplateTypeEnum.Email, 132, [122])
        .subscribe((actualVersion) => {
          actualTemplateVersionInfo = actualVersion;
        });

      // assert
      expect(actualTemplateVersionInfo).toEqual(
        expectedTemplateVersionInfo.templateVersionInfo.items
      );
      expect(httpSpy.post).toHaveBeenCalled();
    });
  });

  describe('getTemplateTagsByVersionId', () => {
    it('should call http post', () => {
      // arrange
      const expectedTags = {
        tagsByTemplateVersionId: [],
      };
      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedTags),
          message: null,
          success: true,
        })
      );

      // act
      service.getTemplateTagsByVersionId(123).subscribe((actualTags) => {
        // assert
        expect(actualTags).toEqual(expectedTags.tagsByTemplateVersionId);
        expect(httpSpy.post).toHaveBeenCalled();
      });
    });

    it('should call http post and return empty', () => {
      // arrange
      const expectedTags = {
        tagsByTemplateVersionId: [],
      };
      httpSpy.post.and.returnValue(
        of({
          message: null,
          success: false,
        })
      );

      // act
      service.getTemplateTagsByVersionId(123).subscribe((actualTags) => {
        // assert
        expect(actualTags).toEqual(expectedTags.tagsByTemplateVersionId);
        expect(httpSpy.post).toHaveBeenCalled();
      });
    });

    it('should call map radio values', () => {
      // arrange
      const expectedTags = {
        tagsByTemplateVersionId: [
          {
            type: TagTypeEnum.RadioGroup,
            category: TagCategoryEnum.UserInput,
            options: [
              {
                label: 'test',
                value: 1,
                htmlValue: '<div>Test</div>',
                isDefault: true,
              },
            ],
          },
        ],
      };

      const getTagValuesByTagIdSpy = spyOn(service, 'getTagValuesByTagId');

      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedTags),
          message: null,
          success: true,
        })
      );
      getTagValuesByTagIdSpy.and.returnValue(
        of([
          {
            applyConditions: [{ applyConditionId: 1, name: 'test' }],
            htmlValue: '<div>Test</div>',
            isDefault: true,
          },
        ])
      );

      // act
      service.getTemplateTagsByVersionId(123).subscribe((actualTags) => {
        // assert
        expect(actualTags).toEqual(expectedTags.tagsByTemplateVersionId as any);
        expect(httpSpy.post).toHaveBeenCalled();
      });
    });
  });

  describe('getTemplatesList', () => {
    it('should call http post', () => {
      // arrange
      const expectedTemplates = {
        templates: {
          items: [],
        },
      };

      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedTemplates),
          message: null,
          success: true,
        })
      );

      // act
      service
        .getTemplatesList(TemplateTypeEnum.Email, TemplateSubTypeEnum.Voucher)
        .subscribe((actualTemplates) => {
          // assert
          expect(actualTemplates).toEqual(expectedTemplates.templates.items);
          expect(httpSpy.post).toHaveBeenCalled();
        });
    });

    it('should call http post with keyword', () => {
      // arrange
      const expectedTemplates = {
        templates: {
          items: [],
        },
      };

      const keyword = 'test';

      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedTemplates),
          message: null,
          success: true,
        })
      );

      // act
      service
        .getTemplatesList(
          TemplateTypeEnum.Email,
          TemplateSubTypeEnum.Voucher,
          keyword,
          123
        )
        .subscribe((actualTemplates) => {
          // assert
          expect(actualTemplates).toEqual(expectedTemplates.templates.items);
          expect(httpSpy.post).toHaveBeenCalled();
        });
    });
  });

  describe('getTemplateLanguageByTemplateId', () => {
    it('should call http post', () => {
      // arrange
      const expectedLanguage = {
        languageListByTemplateId: [],
      };

      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedLanguage),
          message: null,
          success: true,
        })
      );

      // act
      service
        .getTemplateLanguageByTemplateId(123)
        .subscribe((actualLanguage) => {
          // assert
          expect(actualLanguage).toEqual(
            expectedLanguage.languageListByTemplateId
          );
          expect(httpSpy.post).toHaveBeenCalled();
        });
    });
  });

  describe('getTagValuesByTagId', () => {
    it('should call http post', () => {
      // arrange
      const expectedTagValues = {
        tagValueByTagId: [],
      };

      httpSpy.post.and.returnValue(
        of({
          data: JSON.stringify(expectedTagValues),
          message: null,
          success: true,
        })
      );

      // act
      service.getTagValuesByTagId(123).subscribe((actualTagValues) => {
        // assert
        expect(actualTagValues).toEqual(expectedTagValues.tagValueByTagId);
        expect(httpSpy.post).toHaveBeenCalled();
      });
    });
  });

  describe('getTemplateFullDetails', () => {
    it('should return null when no template lanugage', () => {
      // arrange
      const expectedTemplate = {
        defaultLanguage: 66,
        languageId: 66,
        templateVersionId: 1,
        templateVersionLanguages: [{ value: 1, label: 'Chinese' }],
        defaultTemplateVersion: {
          defaultLanguage: 66,
          templateVersionId: 1,
          languageId: 66,
          templateTags: [],
          templateTagValue: [],
        },
        templateVersions: [
          {
            defaultLanguage: 66,
            languageId: 66,
            templateVersionId: 1,
          },
        ],
      };
      spyOn(service, 'getTemplateLanguageByTemplateId').and.returnValue(
        of([{ templateVersionId: 1, isDefaultLanguage: true, languageId: 66 }])
      );

      spyOn(service, 'getTemplateDetails').and.returnValue(
        of([
          {
            defaultLanguage: 66,
            languageId: 66,
            templateVersionId: 1,
          } as TemplateVersion,
        ])
      );

      spyOn(service, 'getTemplateTagsByVersionId').and.returnValue(of([]));

      // act
      service
        .getTemplateFullDetails(
          { templateId: 1, templateVersionId: 1 } as Template,
          TemplateTypeEnum.Email
        )
        .subscribe((actualFullTemplate) => {
          expect(actualFullTemplate).toEqual(
            expectedTemplate as unknown as Template
          );
        });
    });
  });

  describe('getTemplateByVersionIds()', () => {
    it('should call http post', () => {
      // arrange
      httpSpy.post.and.returnValue(
        of({
          success: true,
          data: JSON.stringify({
            templateVersionInfo: {
              items: [{}],
            },
          }),
        })
      );

      // act
      service.getTemplateByVersionIds([1, 2, 3], 1).subscribe((result) => {
        // assert
        expect(httpSpy.post).toHaveBeenCalled();
      });
    });
  });
});
