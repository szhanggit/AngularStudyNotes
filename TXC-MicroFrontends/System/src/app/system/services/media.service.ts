import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { TenantConfigService } from './tenant-config.service';
import { MediaLibListState } from '../models/media-library-list-state.model';
import { MediaLibraryList } from '../models/media-library-list.model';
import { MediaCategoryEnum } from '../enum/mediaCategory.enum';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private _mediaLibList$ = new BehaviorSubject<MediaLibraryList[]>([]);
  private _search$ = new Subject<void>();
  
  private _state: MediaLibListState = {
    category: MediaCategoryEnum.Edenred,
    searchTerm: '',
  }

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { 
      this._search$.pipe(
        switchMap(() => this.getMediaList())
      ).subscribe((res: BaseResponse) => {
        if (res.data) {
          this._mediaLibList$.next(JSON.parse(res.data)?.media);
        } else {
          this._mediaLibList$.next([]);
        }
      });
      this._search$.next();
    }

  get mediaLibrary$() { return this._mediaLibList$.asObservable(); }
  get category() { return this._state.category; }
  get searchTerm() { return this._state.searchTerm; }

  set category(category: number) { this._set({ category }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm }); }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  private _set(patch: Partial<MediaLibListState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private getMediaList(): Observable<BaseResponse> {
    const { category, searchTerm } = this._state;
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = {
      query: `query
      {
        media(where: {and: {keyword: {contains: "${searchTerm}"}, type: {eq: ${category}}}}) {
            items {
                mediaId
                fileName
                fileContentType
                nodeUrl
                account
                blobName
                type
                width
                height
                keyword
            }
        }
    }`};

    return this.http.post(url, data, {
      headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant())
    }) as Observable<BaseResponse>;
  }

}
