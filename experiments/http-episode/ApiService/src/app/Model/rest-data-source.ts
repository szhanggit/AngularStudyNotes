import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Student } from '../Model/student';

export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSource {
    constructor(private http: HttpClient, @Inject(REST_URL) private url: string){}
    getData(): Observable<Student[]> {
        return this.sendRequest<Student[]>("GET", this.url, "Students/grade1");
    }

    saveStudent(student: Student): Observable<Student> {
        return this.sendRequest<Student>("POST", this.url, 'Students', student);
    }

    updateStudent(student: Student): Observable<Student> {
        return this.sendRequest<Student>("PUT", this.url, 'Students', student);
    }

    deleteStudent(id: number): Observable<Student> {
        return this.sendRequest<Student>("DELETE", this.url, 'Students?studentId=5');
    }

    private sendRequest<T>(verb: string, url: string, control: string, body?: Student): Observable<T> {

        let myHeaders = new HttpHeaders();
        myHeaders = myHeaders.set("Access-Key", "<secret>");
        myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);

        return this.http.request<T>(verb, url+control, {
            body: body,
            /*headers: new HttpHeaders({
                "Access-Key": "<secret>",
                "Application-Name": "exampleApp"
            })*/
            headers: myHeaders
        }).pipe(catchError((error: Response) =>
        throwError(`Network Error: ${error.statusText} (${error.status})`)));
    }
}
