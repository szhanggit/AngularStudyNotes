import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap, throwError, shareReplay } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentRepositoryService } from '../model/student.repository.service';
import { Student } from '../model/student.model';
import { GetStudentsResp } from '../model/student.response.model';
import { BaseResponse } from '../model/base-response.model';
import { StudentStatus } from '../model/student.status.model';
import { StateService } from '../service/state.service';

interface StudentState{
  students: Student[];
  selectedStudentId: number | undefined;
}

const INITIAL_STATE: StudentState = {
  students: [],
  selectedStudentId: undefined
}

@Injectable({
  providedIn: 'root'
})
export class StudentService extends StateService<StudentState> {
  private _studentRepo: StudentRepositoryService;
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _students$ = new BehaviorSubject<Student[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _studentStatus: StudentStatus;
  currentStudents$: Observable<Student[]> = this.select(state => state.students);

  selectedStudent$: Observable<Student | undefined> = this.select((state) => {
    return state.students.find((student) => student.id === state.selectedStudentId);
  });


  constructor(private http: HttpClient, private studentRepo: StudentRepositoryService) {     
    super(INITIAL_STATE);
    this._studentRepo = studentRepo;
    this._studentStatus = new StudentStatus(0,0);
    this._search$.pipe(
      //tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._studentRepo.getAllStudents()),
      shareReplay(),  //8. adding this statement, will solve sending multiple http requests issue.
      delay(200),
      //tap(() => this._loading$.next(false))
    ).subscribe((res: GetStudentsResp) => {
      if (res.data) {
        this._students$.next(res.data.studentDtos);
        this._total$.next(res.data.totalCount);
        this.setState({students: [...this.state.students, ...res.data.studentDtos], selectedStudentId: 0});
      } else {
        this._students$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next(); //Trigger code above.
  }

  getGoodStudent(): Observable<GetStudentsResp>{
    var _goodStudents$ = this._studentRepo.getGoodStudents();
    _goodStudents$.subscribe((res: GetStudentsResp) => {
      if(res.data){
        this.setState({students: [...this.state.students, ...res.data.studentDtos], selectedStudentId: 0});
      }
    });
    return _goodStudents$;
  }

  setStatus(StudentId: number, Status: number): Observable<BaseResponse>{
    return this._studentRepo.setFormStudentStatus(StudentId, Status);
  }

  setJsonStatus(StudentId: number, Status: number): Observable<BaseResponse>{
    this._studentStatus.studentId = StudentId;
    this._studentStatus.status = Status;
    return this._studentRepo.setJsonStudentStatus(this._studentStatus);
  }

  get students$() { return this._students$.asObservable(); }
  get total$() { return this._total$.asObservable(); }




  refresh() {
    this._search$.next();
  }
}
