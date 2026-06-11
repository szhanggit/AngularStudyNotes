import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { Template } from 'src/app/system/models/template-list.model';
import { TemplateService } from 'src/app/system/services/template.service';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  @ViewChild(NgbNav) nav!: NgbNav;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  
  loading$!: Observable<boolean>;
  total$!: Observable<number>;
  templateList$: Observable<Template[]>;

  statusData: Select2Data = [
    { value: 1, label: 'Status: Active' },
    { value: 0, label: 'Status: Inactive' },
  ];

  pageSizes: Select2Data = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 200, label: '200' },
    { value: '', label: 'All' },
  ];
  
  total: number = 0;
  
  get itemStart() {
    return this._templateService.page === 1
      ? 1
      : this.total < 1
      ? this.total
      : (this._templateService.page - 1) * this._templateService.pageSize + 1;
  }

  get itemEnd() {
    return this._templateService.page === this.pageCount ||
      this.total < this._templateService.page * this._templateService.pageSize
      ? this.total
      : this._templateService.page * this._templateService.pageSize;
  }

  get pageCount() {
    return Math.ceil(this.total / this._templateService.pageSize);
  }
  
  constructor(public _templateService: TemplateService) { 
    this.templateList$ = _templateService.templateList$;
    this.total$ = _templateService.total$;
  }

  ngOnInit(): void {
    this.loading$ = this._templateService.loading$;
    this.total$ = this._templateService.total$;
    this.total$.pipe(takeUntil(this.destroyed$)).subscribe((total) => {
      this.total = total;
      this.pageSizes.filter((size:any) => size.label === 'All')?.map((ele:any) => ele.value = this.total);
      if(!this._templateService.pageSize) this._templateService.pageSize = this.total;
    });
  }

  ngAfterViewInit(): void {
    this.nav.navChange.subscribe(e => {
      this._templateService.subType = e.nextId;
      this._templateService.page = 1;
    })
  }

  ngOnDestroy() {
    this._templateService.reset()
  }
}
