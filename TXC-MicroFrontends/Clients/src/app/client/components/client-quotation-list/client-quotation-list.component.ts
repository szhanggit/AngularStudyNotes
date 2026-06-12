import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { QuotationListComponent } from '../quotation-list/quotation-list.component';

@Component({
  selector: 'app-client-quotation-list',
  templateUrl: './client-quotation-list.component.html',
  styleUrls: ['./client-quotation-list.component.scss']
})
export class ClientQuotationListComponent implements OnInit {
  readonly DELIMITER = '/';
  pageIndex : number = 0;
  pageSize : number = 20;  
  clientIdentityCode:string='';
  keyword:string='' ;
  clientName:string='';
  validAt:NgbDate;
  quotationFormGroup: FormGroup = new FormGroup({});
  @ViewChild(QuotationListComponent) quotationComponent!: QuotationListComponent;
  
  constructor(calendar: NgbCalendar,private readonly _formBuilder: FormBuilder) {
     this.validAt = new NgbDate(calendar.getToday().year, calendar.getToday().month, calendar.getToday().day);
    
    this.quotationFormGroup = this._formBuilder.group({
      keyword: new FormControl({ value: '', disabled: false }),
      clientName: new FormControl({ value: '', disabled: false }),
      validAt: new FormControl({ value: '', disabled: false }),     
    });
   }
  ngOnInit(): void {
  }
  onDateSelection(date: NgbDate) {
    if (date != null)
      this.f.validAt.setValue(this.toModel(date));
    else
      this.f.validAt.setValue("");
  }
  toModel(date: NgbDate | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }
  get f(): any {
    return this.quotationFormGroup.controls;
  }  
  searchQuotation(){      
    this.keyword= this.quotationFormGroup.contains('keyword') && this.f.keyword.value.trim() !== ''? this.f.keyword.value.trim():'';
    this.clientName=this.quotationFormGroup.contains('clientName') && this.f.clientName.value.trim() !== ''? this.f.clientName.value.trim():'';
    this.validAt=this.quotationFormGroup.contains('validAt') && this.f.validAt.value !== null? this.f.validAt.value.trim():null;
    this.quotationComponent.getData(this.pageIndex,this.pageSize,this.clientIdentityCode,this.keyword,32,"");
  }
  
}
