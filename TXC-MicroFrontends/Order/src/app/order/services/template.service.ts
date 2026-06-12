import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map, switchMap, of } from 'rxjs';
import {
  TagCategoryEnum,
  TagTypeEnum,
  TemplateSubTypeEnum,
  TemplateTypeEnum,
} from 'src/app/shared/enums/template.enum';
import { TemplateTag } from 'src/app/shared/models/template-tag.model';
import {
  TagValue,
  Template,
  TemplateVersion,
  TemplateVersionLanguage,
} from 'src/app/shared/models/template.model';
import { TemplateComponent } from 'src/app/shared/template/template.component';
import { BaseResponse } from '../models/base-response.model';
import { environment } from 'src/environments/environment';
import { LanguageStateService } from './state-service/language-state.service';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private languageStateService: LanguageStateService
  ) {}

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  templatePreviewSingle(template: Template, withTabs: boolean = false) {
    const modalRef = this.modalService.open(TemplateComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.selectedTemplate = template;
    modalRef.componentInstance.withTabs = withTabs;
    modalRef.componentInstance.replaceTags();
  }

  templatePreviewWithTabs(
    emailTemplate: TemplateVersion | null | undefined,
    smsTemplate: TemplateVersion | null | undefined,
    type: number
  ) {
    const modalRef = this.modalService.open(TemplateComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.activeTab = type;
    modalRef.componentInstance.emailTemplate =
      { ...emailTemplate } ?? undefined;
    modalRef.componentInstance.smsTemplate = { ...smsTemplate } ?? undefined;
    modalRef.componentInstance.applyTagValues();
    modalRef.componentInstance.replaceTags();
  }

  // TODO: make dynamic mapping
  mapSmsTags(smsTemplate: Template, productName: string, smsGreetings: string) {
    smsTemplate.templateTagValue = [
      {
        tagId: 6,
        value: productName,
        textValue: null,
      },
      {
        tagId: 9,
        value: smsGreetings,
        textValue: null,
      },
    ];
  }

  getProductTemplate(
    id: Number,
    templateType: Number
  ): Observable<BaseResponse> {
    const url = `${this.getURL()}api/Product/Template?ProductId=${id}&TemplateType=${templateType}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  getTemplateDetails(
    type: number,
    templateId: number,
    templateVersionIds: number[]
  ): Observable<TemplateVersion[]> {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const ids = templateVersionIds.join(',');
    const body = {
      query: `
      query {
        templateVersionInfo (skip: 0, take: 100,
          where: {              
              or :[{
                and: [
                  {templateVersionId: {in: [${ids}]}}
                  {type:  {eq: ${type}}}
                ]}
                {and: [
                    {templateVersionId: {nin: [${ids}]}}
                    {templateId: {eq: ${templateId}}}
                    {isCurrentVersion: {eq: true}}
                    {type:  {eq: ${type}}}
                ]}
              ]
          }
        ){            
          items {
            templateId,
            subject1,
            subject2,
            subject3,
            subType,
            status,
            content1,
            content2,
            content3,
            isCurrentVersion,
            attachmentTemplateVersionId,
            defaultLanguage,
            description,
            languageId,
            templateName,
            type,
            templateVersionId,
            version
          },
          totalCount
        }
      }`,
    };

    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data).templateVersionInfo.items;
        }
      })
    );
  }

  getTemplateByVersionIds(
    templateVersionIds: number[],
    type: TemplateTypeEnum
  ): Observable<Template[]> {
    const ids = templateVersionIds.join(',');
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query {
        templateVersionInfo(skip: 0, take: 10 
          where: { 
            and: [
              {templateVersionId: {in: [${ids}]}}
              {type:  {eq: ${type}}}
            ]
          }
          ) {
            items {
            templateId,
            type,
            subType,
            subject1,
            subject2,
            subject3,
            content1,
            content2,
            content3,
            isCurrentVersion,
            attachmentTemplateVersionId,
            templateName,
            templateVersionId,
            version,
            defaultLanguage,
            languageId
          },
          totalCount
          }
        }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data).templateVersionInfo.items;
        }
      })
    );
  }

  getTemplateTagsByVersionId(
    templateVersionId: number
  ): Observable<TemplateTag[]> {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query {
        tagsByTemplateVersionId(templateVersionId: ${templateVersionId}) {
          displayName,
          applyToHtmlTemplate,
          applyToTextTemplate,
          category,defaultValue,
          displayName,
          description,
          reflectionType,
          scopeLevel,
          tagId,
          tagName,
          type
        }
      }`,
    };

    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      switchMap((response: BaseResponse) => {
        if (response.success) {
          const tags = JSON.parse(
            response.data
          )?.tagsByTemplateVersionId;

          const radioGroupTag = tags.find(
            (tag: TemplateTag) => tag.type === TagTypeEnum.RadioGroup
          );

          if (radioGroupTag) {
            return this.getTagValuesByTagId(radioGroupTag.tagId).pipe(
              map((tagValues) => {
                radioGroupTag.options = tagValues.map(
                  (tv: {
                    applyConditions: {
                      applyConditionId: number;
                      name: string;
                    }[];
                    tagId: number;
                    htmlValue: string;
                    isDefault: boolean;
                  }) => {
                    return {
                      label: tv.applyConditions[0].name,
                      value: tv.applyConditions[0].applyConditionId,
                      htmlValue: tv.htmlValue,
                      isDefault: tv.isDefault,
                    };
                  }
                );

                return tags;
              })
            );
          } else {
            return of(tags);
          }
        } else {
          return of([]);
        }
      })
    );
  }

  getTemplatesList(
    type: TemplateTypeEnum,
    subType: TemplateSubTypeEnum,
    term: string = '',
    templateId: number = 0
  ): Observable<Template[]> {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const templateNameCondition = term
      ? `{templateName: {contains: "${term}"}}`
      : '';
    const templateIdCondition =
      templateId > 0 ? `templateId: { eq: ${templateId}}}` : '';

    const body = {
      query: `
      query {
        templates(where:
          {
              and: [
                  {status: { eq: 1}}
                  {type: { eq: ${type}}}
                  {subType: { eq: ${subType}}}
                  ${templateNameCondition}
                  ${templateIdCondition}
              ]
          },
          skip: 0,
          take: 10
        )
        {
          items {
              templateId
              templateName
              type
              defaultLanguage
          }
        }
      }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data).templates.items;
        }
      })
    );
  }

  getTemplateLanguageByTemplateId(
    templateId: number
  ): Observable<TemplateVersionLanguage[]> {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query {
        languageListByTemplateId(templateId: ${templateId}) {
          templateVersionId,
          languageId,
          isDefaultLanguage
        }
      }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data).languageListByTemplateId;
        }
      })
    );
  }

  getTagValuesByTagId(tagId: number): Observable<any> {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query {
        tagValueByTagId(tagId: ${tagId}) { 
          tagValueId,
          tagId,
          htmlValue,
          textValue,
          isDefault,
          applyConditions { name, applyConditionId }
        }
      }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data).tagValueByTagId;
        }
      })
    );
  }

  getTemplateFullDetails(
    template: Template,
    type: TemplateTypeEnum,
    templateVersions: TemplateVersion[] = [],
    templateTagValue: TagValue[] = []
  ) {
    return this.languageStateService.selectedLanguageList$.pipe(
      // templateVersionLanguage pairing
      switchMap((languages: Dictionary[]) => {
        return this.getTemplateLanguageByTemplateId(template.templateId).pipe(
          map((templateVersionLanguage: TemplateVersionLanguage[]) => {
            templateVersionLanguage
              .map((versionLanguage) => {
                const templateVersionOverride = templateVersions.find(
                  (version) => version.languageId === versionLanguage.languageId
                );
                if (templateVersionOverride) {
                  versionLanguage.templateVersionId =
                    templateVersionOverride.templateVersionId;
                }

                return {
                  ...versionLanguage,
                };
              })
              .sort(
                (a, b) =>
                  Number(b.isDefaultLanguage) - Number(a.isDefaultLanguage)
              );
            return {
              templateVersionLanguages: this.mapTemplateLanguageList(
                templateVersionLanguage,
                languages
              ),
            } as unknown as Template;
          })
        );
      }),
      // templateVersions details
      switchMap((fullDetailTemplate: Template) => {
        if (!fullDetailTemplate.templateVersionLanguages) return of(null);

        const templateVersionLanguages = [
          ...fullDetailTemplate.templateVersionLanguages,
        ];
        const templateVersionIds =
          fullDetailTemplate.templateVersionLanguages.map(
            (versionLanguage) => (versionLanguage as { value: number }).value
          );

        return this.getTemplateDetails(
          type,
          template.templateId,
          templateVersionIds
        ).pipe(
          map((templateVersions: TemplateVersion[]) => {
            const defaultTemplateVersion = templateVersions.find(
              (version) =>
                version.languageId === version.defaultLanguage &&
                templateVersionIds.includes(version.templateVersionId)
            );
            if (!defaultTemplateVersion) {
              return null;
            }

            fullDetailTemplate = { ...defaultTemplateVersion };
            fullDetailTemplate.templateVersionLanguages = [
              ...templateVersionLanguages,
            ];
            fullDetailTemplate.defaultTemplateVersion = {
              ...defaultTemplateVersion,
            };
            fullDetailTemplate.templateVersions = [...templateVersions];

            if (template.productTemplateVersion) {
              fullDetailTemplate.productTemplateVersion = [
                ...template.productTemplateVersion,
              ];
            }

            return fullDetailTemplate;
          })
        );
      }),
      // defaultTemplateVersion Tags
      switchMap((fullDetailTemplate: Template | null) => {
        if (!fullDetailTemplate || !fullDetailTemplate.defaultTemplateVersion)
          return of(null);

        return this.getTemplateTagsByVersionId(
          fullDetailTemplate.defaultTemplateVersion.templateVersionId
        ).pipe(
          map((tags: TemplateTag[]) => {
            if (
              !fullDetailTemplate ||
              !fullDetailTemplate.defaultTemplateVersion
            )
              return null;

            fullDetailTemplate.defaultTemplateVersion.templateTags = tags;
            fullDetailTemplate.defaultTemplateVersion.templateTagValue =
              templateTagValue;

            return fullDetailTemplate;
          })
        );
      })
    );
  }

  private mapTemplateLanguageList(
    templateVersionLanguage: TemplateVersionLanguage[],
    languages: Dictionary[]
  ) {
    return [
      ...languages
        .filter((language: Dictionary) => {
          const getTemplateVersion = templateVersionLanguage.find(
            (templateVersionLanguage) =>
              templateVersionLanguage.languageId === language.dictionaryId
          );

          return getTemplateVersion;
        })
        .map((language) => {
          const getTemplateVersion = templateVersionLanguage.find(
            (templateVersionLanguage) =>
              templateVersionLanguage.languageId === language.dictionaryId
          );

          return {
            value: getTemplateVersion!.templateVersionId,
            label: language.displayName,
          };
        }),
    ];
  }
}
