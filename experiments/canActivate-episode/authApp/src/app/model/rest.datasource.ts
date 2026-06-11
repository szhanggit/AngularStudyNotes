import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestDataSource {
    baseUrl: string;
    auth_token: string = "";
    constructor(private http: HttpClient) {
        this.baseUrl = `https://localhost:7002/api/`;
    }

    authenticate(user: string, pass: string): Observable<boolean> {
        return this.http.post<any>(this.baseUrl + "login", {
            name: user, password: pass
        }).pipe(map(response => {
            this.auth_token = response.success ? response.token : null;
            return response.success;
        }));
    }

    private getOptions() {
        return {
            headers: new HttpHeaders({"Authorization": `Bearer<${this.auth_token}>`})
        }
    }    
}

