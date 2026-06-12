import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private _mappedAddressReference = {}

  get mappedAddressReference() {
    return this._mappedAddressReference;
  }

  set mappedAddressReference(value: any) {
    this._mappedAddressReference = value;
  }

  constructor(private http: HttpClient) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  // get dictionary items by category using graphql endpoint
  getDictionaryItemsByCategory(category: string): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{dictionaries (where: { category: { eq: "${category}"}}) { dictionaryId displayName parentId }}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  getCityStateCountry() {
    return forkJoin([
      this.getDictionaryItemsByCategory('City'),
      this.getDictionaryItemsByCategory('StateOrProvince'),
      this.getDictionaryItemsByCategory('Country'),
    ]);
  }

  getMappedAddressReference(
    cities: Dictionary[],
    statesOrProvinces: Dictionary[], 
    countries: Dictionary[],
    ) {
    return countries.flatMap((parent: any) =>
      statesOrProvinces
        .filter(
          (nestedParent: any) =>
            nestedParent.parentId === parent.dictionaryId
        )
        .flatMap((nestedParent: any) =>
          cities
            .filter(
              (child: any) => child.parentId === nestedParent.dictionaryId
            )
            .map((child: any) => ({
              Country: parent.displayName,
              State: nestedParent.displayName,
              City: child.displayName,
            }))
        )
    );
  }
}
