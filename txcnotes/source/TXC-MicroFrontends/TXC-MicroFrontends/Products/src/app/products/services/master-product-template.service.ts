import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { TemplateSubType, TemplateType } from '../models/product-template.model';

@Injectable({
  providedIn: 'root'
})
export class MasterProductTemplateService {

  constructor(private http: HttpClient
  ) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  getTemplatesList(type: TemplateType, subType: TemplateSubType, term: string = "", templateId: number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const templateNameCondition = term ? `{templateName: {contains: "${term}"}}` : "";
    const templateIdCondition = templateId > 0 ? `templateId: { eq: ${templateId}}}` : "";

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
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getTemplateDetailsByVersionIdAndTemplateId(type: number, templateId : number ,templateVersionIds: number[]): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const ids = templateVersionIds.join(',');
    const body = {
      query: `
      query{
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
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getTemplateDetailsCurrentVersion(type: number, templateId: number, isEditMode: boolean = false): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const isCurrentVersion = isEditMode ? "" : `{isCurrentVersion: {eq: true}}`;
    const body = {
      query: `
      query{
        templateVersionInfo (skip: 0, take: 100,
          where: {
              and: [
                {templateId: {eq: ${templateId}}}
                ${isCurrentVersion}
                {type:  {eq: ${type}}}
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
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getTagsByTemplateVersionId(templateVersionId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query{
        tagsByTemplateVersionId(templateVersionId: ${templateVersionId}) {
          displayName,
          applyToHtmlTemplate,
          applyToTextTemplate,
          category,
          defaultValue,
          displayName,
          description,
          reflectionType,
          scopeLevel,
          tagId,
          tagName,
          type
        }
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getTagValueByTagIds(tagIds: number[]): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const ids = tagIds.join(',');
    const body = {
      query: `      
      query{
        tagValues(where:{tagId :{in:[${ids}]}})
        {
            items
            {
                tagId
                tagValueId
                tags
                {
                    tagId
                    tagName
                }
                htmlValue
                textValue
                isDefault
                applyConditions
                 {
                   name,
                   applyConditionId,
                 }
            }
        }
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }
}

