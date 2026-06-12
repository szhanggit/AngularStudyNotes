import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BehaviorSubject, debounceTime, delay, Observable, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { TemplateState } from '../models/template-state.model';
import { Template } from '../models/template.model';
import { MasterProductTemplateService } from './master-product-template.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(private http: HttpClient,
    private readonly masterTemplateService: MasterProductTemplateService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(1000),
      switchMap(() => this.masterTemplateService.getTemplatesList(this.type, this.type, this.templateName)),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: BaseResponse) => {
      if (res.data) {
        // trigger next if there are data retrieve
        this._templates$.next(JSON.parse(res.data).templates.items);
      } else {
        this._templates$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  // initialize observables
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _search$ = new Subject<void>();
  private _templates$ = new BehaviorSubject<Template[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public typeChanged$ = new BehaviorSubject<boolean>(false);

  // default merchant table state values
  private _state: TemplateState = {
    templateName: '',
    type: 1
  }

  // merchant table property getters, might return observables or values
  get template$() { return this._templates$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get templateName() { return this._state.templateName; }
  get type() { return this._state.type; }

  // merchant table property setters, when change will reactively call merchantService._getMerchants based on properties provided
  set templateName(templateName: string) { this._set({ templateName }); }
  set type(type: number) {
    {
      this._set({ type });
      this.typeChanged$.next(true);
    }
  }
  set loading(value: boolean) {
    this._loading$.next(value);
  }

  private _set(patch: Partial<TemplateState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  getTemplateByVersionId(templateVersionId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{templateVersionInfo(skip: 0, take: 10 
          where: { 
            and: [
              {templateVersionId: {eq: ${templateVersionId}}}
            ]
          }
          ) {items {templateId,type,subject1,subject2,subject3,content1,content2,content3,isCurrentVersion,attachmentTemplateVersionId,templateName,templateVersionId,version,defaultLanguage,languageId},totalCount}}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
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
            templateVersionId,
            version
          },
          totalCount
        }
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getTemplateTagsByVersionId(templateVersionId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{tagsByTemplateVersionId(templateVersionId: ${templateVersionId}) {displayName,applyToHtmlTemplate,applyToTextTemplate,category,defaultValue,displayName,description,reflectionType,scopeLevel,tagId,tagName,type}}`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getTemplateLanguageByTemplateId(templateId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{languageListByTemplateId(templateId: ${templateId}) {templateVersionId,languageId,isDefaultLanguage}}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  getTagValuesByTagId(tagId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{tagValueByTagId(tagId: ${tagId}) 
          { tagValueId, tagId,
            htmlValue,
            textValue,
            isDefault,
            applyConditions { name, applyConditionId }
          }
        }`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }
}
