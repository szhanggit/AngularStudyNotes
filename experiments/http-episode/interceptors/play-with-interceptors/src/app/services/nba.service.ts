import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NbAService {

  constructor(private httpClient: HttpClient) {

  }

  getPlayers(): Observable<any> {
    return this.httpClient.get('https://www.balldontlie.io/api/v1/players').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getTeams(): Observable<any> {
    return this.httpClient.get('https://www.balldontlie.io/api/v1/teams').pipe(
      map((response: any) => {
        console.log(response);
        return response.data;
      })
    );
  }

}
