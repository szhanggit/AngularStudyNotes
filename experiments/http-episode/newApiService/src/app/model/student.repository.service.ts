import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Student } from './student.model';
import { RestDatasourceService } from '../service/rest.datasource.service';
import { GetStudentsResp } from '../model/student.response.model';
import { BaseResponse } from '../model/base-response.model';
import { StudentStatus } from '../model/student.status.model';

@Injectable({
  providedIn: 'root'
})
export class StudentRepositoryService {
  private students: Student[] = new Array<Student>();
  private locator = (s: Student, id: number) => s.id == id;
  private _dataSource: RestDatasourceService;
  private _controller: string;
  private _action: string;

  constructor(private dataSource: RestDatasourceService) { 
    this._dataSource = dataSource;
    this._controller = '/Students';
    this._action = '/all';
  }

  getAllStudents(): Observable<GetStudentsResp>{
    return this._dataSource.getData<GetStudentsResp>(this._controller, this._action);
  }

  getGoodStudents(): Observable<GetStudentsResp>{
    this._controller = '/Students';
    this._action = '/good';
    return this._dataSource.getData<GetStudentsResp>(this._controller, this._action);
  }

  setFormStudentStatus(StudentId: number, Status: number): Observable<BaseResponse>{
    this._controller = '/Students';
    this._action = '/Status';
    const formData: any = new FormData();
    formData.append('StudentId', StudentId.toString());
    formData.append('Status', Status.toString());
    return this._dataSource.updateData<BaseResponse>(this._controller, this._action, formData);
  }

  setJsonStudentStatus(body: StudentStatus): Observable<BaseResponse>{
    this._controller = '/Students';
    this._action = '/JsonStatus';
    return this._dataSource.updateData_V2(this._controller, this._action, body);
  }
}
