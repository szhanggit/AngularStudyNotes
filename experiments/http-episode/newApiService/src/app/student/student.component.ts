import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { Student } from '../model/student.model';
import { StudentService } from '../service/student.service';
import { RestDatasourceService } from '../service/rest.datasource.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {
  // list of products 
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  students$: Observable<Student[]>;
  total$: Observable<number>;
  _dataSource: RestDatasourceService;

  constructor(public studentSvc: StudentService, dataSourceService: RestDatasourceService) { 
    this._dataSource = dataSourceService;
    this.students$ = studentSvc.students$;
    this.total$ = studentSvc.total$;


    /*studentSvc.students$.subscribe(res => {
      console.log(res);
      //var list = res as Student[];
      //list.forEach(element => {
      //  console.log(element.FirstName);
      //});
    });*/
  }

  getGoodStudents(){
    this.studentSvc.getGoodStudent().pipe(takeUntil(this.destroyed$)).subscribe(
      res => {
        /*res?.data?.studentDtos.forEach((elem)=>{
          console.log(`First Name: ${elem.firstName} Last Name: ${elem.lastName} Grade: ${elem.grade}`);
        });*/
        this.studentSvc.currentStudents$.subscribe((list: Student[]) => {
          list.forEach((elem)=>{
            console.log(`First Name: ${elem.firstName} Last Name: ${elem.lastName} Grade: ${elem.grade}`);
          });
        });
      }
    );
  }

  setStudentStatus(index: number){
    this.studentSvc.setStatus(index, 1).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((res: any) => {
      if(res.success){
        //this.toast?.showSuccess(`Status for ${product.productName} was successfully updated to ${product.status ? 'active' : 'inactive'}.`);
      } else {
        /*
        if (res.message) {
          this.toast?.showDanger(res.message);
        } else {
          this.toast?.showDanger(`There was a problem updating status of product ${product.productName}.`);
        }        
        */
      }
      this.studentSvc.refresh();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
