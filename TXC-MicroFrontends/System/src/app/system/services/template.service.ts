import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { TemplateState } from '../models/template-state.model';
import { HttpClient } from '@angular/common/http';
import { GetTemplateList, Template } from '../models/template-list.model';
import { environment } from 'src/environments/environment';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _templateList$ = new BehaviorSubject<Template[]>([]);
  private _search$ = new Subject<void>();
  private _total$ = new BehaviorSubject<number>(0);

  private _state: TemplateState = {
    page: 0,
    pageSize: 10,
    searchTerm: '',
    status: 1,
    subType: 0,
  };

  constructor(private http: HttpClient, private readonly _authorizationLibraryService: AuthorizationLibraryService,) { 
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._getTemplateList()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: GetTemplateList) => {
      if (res.data) {
        this._templateList$.next(res.data.templateDtos);
        this._total$.next(res.data.totalCount);
      } else {
        this._templateList$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  get templateList$() {
    return this._templateList$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }
  get status() {
    return this._state.status;
  }
  get subType() {
    return this._state.subType;
  }

  set page(page: number) {
    this.set({ page });
  }
  set pageSize(pageSize: number) {
    this.set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this.set({ searchTerm: searchTerm });
  }
  set status(status: number) {
    this.set({ status });
  }
  set subType(subType: number){
    this.set({ subType})
  }

  private set(patch: Partial<TemplateState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  private _getTemplateList(): Observable<GetTemplateList> {
    const { pageSize, page, searchTerm, status, subType } = this._state;
    const url = `${this.getURL()}api/Template${status ? '?status=' : ''}${status ? status : '?'}${subType ? '&sub_type=' + subType : ''}${page ? '&PageNumber=' + page : ''}${pageSize ? '&RowCount=' + pageSize: ''}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetTemplateList>;
  }

  refresh() {
    this._search$.next();
  }

  reset() {
    this._state = {
      page: 0,
      pageSize: 10,
      searchTerm: '',
      status: 1,
      subType: 0,
    };
  }
}
