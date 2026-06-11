import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, of, mergeMap, ReplaySubject, takeUntil } from 'rxjs';
import { ApiService } from '../services/api.service';
import { HttpParams } from '@angular/common/http';
import { Student } from '../Model/student';

@Component({
  selector: 'app-studentdetail',
  templateUrl: './studentdetail.component.html',
  styleUrls: ['./studentdetail.component.css']
})
export class StudentdetailComponent implements OnInit, OnDestroy {
  private readonly controller = "Students/byId";
  private grade1Student : Student[];
  private grade2Student : Student[];
  private grade3Student : Student[];
  private grade4Student : Student[];
  private grade5Student : Student[];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  selectedFile: File | null = null;
  uploadProgress: number = 0;

  constructor(private readonly apiSvc: ApiService) { 

  }

  ngOnInit(): void {
  }


  getStudentById(studentId: number) {
    var params = {
      id: studentId
    }
    console.log(`getStudentById called`);
    const body = new HttpParams({ fromObject: params })
    //this.apiSvc.getStudentById('Students', 1)
    this.apiSvc.get(this.controller, body)
    //var result = this.apiSvc.postinfo("steven.zhang-extern@renault.com", "Pudong0124zs")
    .subscribe({
      next: data => {
        var res = data as Student;
        console.log(`First Name: ${res.firstName}`);
        console.log("Data: " + JSON.stringify(data));
      },
      error: e => console.log(e),
      complete: () => {console.log('Completed!')}
    });
  }

  getStudentById2(studentId: number) {
    var params = {
      id: studentId
    }
    console.log(`getStudentById called`);
    const body = new HttpParams({ fromObject: params })
    let result = this.apiSvc.getSpecific<Student>(this.controller, body)
    .subscribe({
      next: data => {
        console.log(`First Name: ${data.firstName}`);
        console.log("Data: " + JSON.stringify(data));
      },
      error: e => console.log(e),
      complete: () => {console.log('Completed!')}
    });
  }

  registerStudent(){
    //let stu :Student = new Student(0,"Zhidan","Zhao",10,true); 
    let stu :Student = { id: 0, firstName: "Zhidan", lastName: "Zhao", grade: 10, gender:true  }; 
    let result = this.apiSvc.postModel('Students', stu)
    .subscribe({
      next: data => {
        console.log(`First Name: ${data.firstName}`);
        console.log("Data: " + JSON.stringify(data));
      },
      error: e => console.log(e),
      complete: () => {console.log('Completed!')}
    });
  }

  editStudent(){
    let stu :Student = { id: 1000, firstName: "Zhidan", lastName: "Zhao", grade: 10, gender:true  }; 
    let result = this.apiSvc.put('Students', stu)
    .subscribe({
      next: data => {
        console.log(`First Name: ${data.firstName}`);
        console.log("Data: " + JSON.stringify(data));
      },
      error: e => console.log(e),
      complete: () => {console.log('Completed!')}
    });
  }

  deleteStudent(studentId :number){
    var params = {
      studentId: studentId
    }
    console.log(`Student Id: ${studentId}`);
    const body = new HttpParams({ fromObject: params })
    let result = this.apiSvc.delete('Students', body)
    .subscribe({
      next: data => {
        console.log("Data: " + JSON.stringify(data));
      },
      error: e => console.log(e),
      complete: () => {console.log('Completed!')}
    });
  }

  download(): void {
    var params = {
      filename: "Resume_Rohith.pdf"
    }
    const body = new HttpParams({ fromObject: params })
    const fileUrl = 'Students/DownloadFile';
    this.apiSvc.downloadFile(fileUrl, body).subscribe(blob => {
      this.apiSvc.saveFile(blob, 'Resume_Rohith.pdf');
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    const fileUrl = 'Students/UploadFile';
    if (this.selectedFile) {
      this.apiSvc.uploadFile(fileUrl, this.selectedFile).subscribe(
        progress => this.uploadProgress = progress,
        error => console.error('Upload failed', error)
      );
    }
  }
  
  getAllStudents() {
    this.studentGradeArrray.forEach((fe,i)=>{
      const subscriber = fe.observable.subscribe({
        next: res=>{
          fe.command(res);
        }, error: e=>{
          console.log(e);
          subscriber.unsubscribe();
        }, complete: ()=>{
          subscriber.unsubscribe();
          console.log(`grade1Student: ${this.grade1Student?.length} | grade2Student: ${this.grade2Student?.length} | grade3Student: ${this.grade3Student?.length} | grade4Student: ${this.grade4Student?.length} | grade5Student: ${this.grade5Student?.length}`);
        }
      });    
    });
  }



  private studentGradeArrray =[
    { 
      observable: this.apiSvc.getSpecific<any>("Students/grade1"), command: (d: any[])=>{
        this.grade1Student = d as Student[];
      }
    },
    { 
      observable: this.apiSvc.getSpecific<any>("Students/grade2"), command: (d: any[]) =>{
        this.grade2Student = d as Student[];
      }
    },
    {
      observable: this.apiSvc.getSpecific<any>("Students/grade3"), command: (d: any[])=>{
        this.grade3Student = d as Student[];
      }
    },
    {
      observable: this.apiSvc.getSpecific<any>("Students/grade4"), command: (d: any[])=>{
        this.grade4Student = d as Student[];
      }
    }, 
    {
      observable: this.apiSvc.getSpecific<any>("Students/grade5"), command: (d: any[])=>{
        this.grade5Student = d as Student[];
      }
    }        
  ];

  forkJoinAllStudents(){
    forkJoin({
      requestOne: this.apiSvc.getSpecific<any>("Students/grade1"),
      requestTwo: this.apiSvc.getSpecific<any>("Students/grade2"),
      requestThree: this.apiSvc.getSpecific<any>("Students/grade3"),
      requestFour: this.apiSvc.getSpecific<any>("Students/grade4"),
      requestFive: this.apiSvc.getSpecific<any>("Students/grade5"),
    }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
      this.grade1Student = response.requestOne;
      this.grade2Student = response.requestTwo;
      this.grade3Student = response.requestThree;
      this.grade4Student = response.requestFour;
      this.grade5Student = response.requestFive;
      console.log(`grade1Student: ${this.grade1Student?.length} | grade2Student: ${this.grade2Student?.length} | grade3Student: ${this.grade3Student?.length} | grade4Student: ${this.grade4Student?.length} | grade5Student: ${this.grade5Student?.length}`);
    }, error => {
      console.error('Error fetching data', error);
    });
  }

  promiseAllStudents(){
    const data1Promise = this.apiSvc.getSpecific<any>("Students/grade1").toPromise();
    const data2Promise = this.apiSvc.getSpecific<any>("Students/grade2").toPromise();
    const data3Promise = this.apiSvc.getSpecific<any>("Students/grade3").toPromise();
    const data4Promise = this.apiSvc.getSpecific<any>("Students/grade4").toPromise();
    const data5Promise = this.apiSvc.getSpecific<any>("Students/grade5").toPromise();

    Promise.all([data1Promise, data2Promise, data3Promise, data4Promise, data5Promise])
    .then((results) => {
      this.grade1Student = results[0];
      this.grade2Student = results[1];
      this.grade3Student = results[2];
      this.grade4Student = results[3];
      this.grade5Student = results[4];
      console.log(`grade1Student: ${this.grade1Student?.length} | grade2Student: ${this.grade2Student?.length} | grade3Student: ${this.grade3Student?.length} | grade4Student: ${this.grade4Student?.length} | grade5Student: ${this.grade5Student?.length}`);
    })
    .catch(error => {
      console.error('Error fetching data', error);
    });
  }

  fetchAllStudents(){
    of(null).pipe(
      mergeMap(() => forkJoin({
        requestOne: this.apiSvc.getSpecific<any>("Students/grade1"),
        requestTwo: this.apiSvc.getSpecific<any>("Students/grade2"),
        requestThree: this.apiSvc.getSpecific<any>("Students/grade3"),
        requestFour: this.apiSvc.getSpecific<any>("Students/grade4"),
        requestFive: this.apiSvc.getSpecific<any>("Students/grade5"),
      }))
    ).pipe(takeUntil(this.destroyed$)).subscribe(response => {
      this.grade1Student = response.requestOne;
      this.grade2Student = response.requestTwo;
      this.grade3Student = response.requestThree;
      this.grade4Student = response.requestFour;
      this.grade5Student = response.requestFive;
      console.log(`grade1Student: ${this.grade1Student?.length} | grade2Student: ${this.grade2Student?.length} | grade3Student: ${this.grade3Student?.length} | grade4Student: ${this.grade4Student?.length} | grade5Student: ${this.grade5Student?.length}`);
    }, error => {
      console.error('Error fetching data', error);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
