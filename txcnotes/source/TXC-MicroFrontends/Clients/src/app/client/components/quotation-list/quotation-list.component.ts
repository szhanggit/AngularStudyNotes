import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { QuotationService } from '../../services/quotation.service';
import { ClientPermissionService } from '../../services/client-permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Quotation } from '../../models/quotation.model';
import { BaseResponse, BaseResponseQ } from '../../models/base-response.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { API_MESSAGE } from '../../enums/messageTypes';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {

  pageIndex : number = 1;
  pageSize : number = 20;
  totalCount : number = 0;
  quotationList : Quotation[] = [];
  status:number=0;  
  validOn!:string;
  keyWord:string='';
  clientNameVisible:boolean=true;
  message!:string;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @Input() clientIdentityCode:string='';

  constructor(private readonly _router: Router,   
    public _clientPermissionService : ClientPermissionService,
    private quotationService : QuotationService) 
    { 
     }

  ngOnInit(): void {
    this.clientIdentityCode!='' ? this.clientNameVisible=false:this.clientNameVisible=true;
    this.getData(this.itemStart-1, this.pageSize,this.clientIdentityCode,this.keyWord,this.status,this.validOn);
  }
 
  //ngOnChanges(changes: SimpleChanges): void {   
    //this.getData(this.itemStart-1, this.pageSize,this.clientIdentityCode,this.keyWord,this.status,this.validOn);
  //}
  getData(pageIndex : number = 0, pageSize : number = 20, clientIdentityCode : string,keyword:string="",status:number, validAt : string){
    this.quotationService.getQuotationList(pageIndex,pageSize,clientIdentityCode,keyword,status,validAt)
    .subscribe((response:BaseResponseQ)=>{         
      if(response.IsSuccess){             
        this.quotationList = response?.Data;
        this.totalCount = response.TotalCount;  
        if(this.totalCount == 0)
        {
          this.totalCount = 0; 
          this.message = API_MESSAGE.Msg01;
        }      
      }
      else {       
        setTimeout(() => {
          
          this.toast?.showDanger(API_MESSAGE.Msg02);
          }, 2000); 
      }
    },
    (err : HttpErrorResponse)=>{       
        setTimeout(() => {
          this.toast?.showDanger(API_MESSAGE.Msg03);
          }, 2000); 
    }
   );
  }
  navigateToClientDetails(clientId : number,clientIdentityCode:string):void {
    this._router.navigate(['clients/details'],
      {
        queryParams: {
          clientId: clientId,
          identityCode: clientIdentityCode,
        }
      });
  }
  pageSizeChanged() : void {
    this.pageIndex = 1;
    this.getData(this.pageIndex, this.pageSize,this.clientIdentityCode,this.keyWord,this.status,this.validOn);
  }
  
  pageChange(){
    this.getData(this.pageIndex, this.pageSize,this.clientIdentityCode,this.keyWord,this.status,this.validOn);
  }
  get itemStart() {
    return this.pageIndex === 1 ? 1 : this.totalCount < 1 ? this.totalCount : (((this.pageIndex - 1) * this.pageSize) + 1);
  }
  get itemEnd() {
    return this.pageIndex === this.pageCount || this.totalCount < this.pageIndex * this.pageSize ? this.totalCount : this.pageIndex * this.pageSize;
  }
  get pageCount() {
    if(this.totalCount == 0)
      return 0;
    return Math.ceil(this.totalCount / ( this.totalCount < this.pageSize ? this.totalCount : this.pageSize));
  }

}
