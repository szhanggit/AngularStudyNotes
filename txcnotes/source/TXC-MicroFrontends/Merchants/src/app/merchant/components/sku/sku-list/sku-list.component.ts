import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Merchant } from '../../../models/merchant.model';
import { SkuService } from '../../../services/sku.service';
import { debounceTime } from 'rxjs/operators';
import { BaseResponse } from '../../../services/base-response.model';
import { MerchantPermissionService } from 'src/app/merchant/services/merchant-permission.service';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { SkuTypeEnum } from 'src/app/merchant/constants/sku_constant';

@Component({
  selector: 'app-sku-list',
  templateUrl: './sku-list.component.html',
  styleUrls: ['./sku-list.component.scss']
})
export class SkuListComponent implements OnInit {
  @Input() merchant!: Merchant;
  @Input() contractId!: number;
  @Input() merchantId!: number;
  @Input() valid!: boolean;
  @Output() hasValidList:EventEmitter<boolean>= new EventEmitter();
  @Output() hasInValidList:EventEmitter<boolean>= new EventEmitter();

  //Variables
  totalCount : number = 0;
  apiTimeout: number =1000;
  debounceTime: number=3000;
  showEditSku : boolean = false;  

  // Pagination start
  pageSize : number = 10;
  pageIndex : number = 1;
  searchTerm : string = "";
  selectedTenantUTC!: string;
  
  //Pagination End
  skuList : any = [];
  SkuTypeEnum = SkuTypeEnum;
  
  MERCHANTDETAILS = 'merchantDetails';
  CONTRACTDETAILS = 'contractDetails';
  //Pagination  Method
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
  
  getSKUStatusClass(item : any) : string{
    let endDate = Date.parse(item.validEndDate);
    let startDate = Date.parse(item.validStartDate);
    let currentDate = Date.parse((new Date()).toISOString());
    if(currentDate < startDate || currentDate < endDate){
      return "badge badge-success-lighten text-dark p-1 lbl-bg-valid";
    }
    else{
      return "badge bg-light text-dark p-1 lbl-bg-expired";
    }
  }

  getSKUStatusLabel(item : any) : string{
    let endDate = Date.parse(item.validEndDate);
    let startDate = Date.parse(item.validStartDate);
    let currentDate = Date.parse((new Date()).toISOString());
    if(currentDate < startDate || currentDate < endDate){
      return "Valid";
    }
    else{
      return "Expired";
    }
  }
  //To Enable & Disable Edit button
  isEditBtnVisible(item : any) : boolean{
    let endDate = Date.parse(item.validEndDate);
    let startDate = Date.parse(item.validStartDate);
    let currentDate = Date.parse((new Date()).toISOString());
    if(currentDate < startDate || currentDate < endDate){
      return true;
    }
    else{
      return false;
    }
  }


  pageSizeChanged() : void {
    this.pageIndex = 1;
    this.getData() 
  }

  //Refresh Grid of Data 
  pageChange(){
   this.getData() 
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getData();
}

onSearchChange(){
  let wordSearch = this.searchTerm;
  setTimeout(() => {
      if (wordSearch == this.searchTerm) {
            this.getData();
      }
  }, this.apiTimeout);
}
 //End Grid

  getData(){
    if(this.merchant){
      this.SkuService.getAll(this.itemStart-1, this.pageSize, this.searchTerm,  this.valid, this.merchant.merchantId).pipe(
        debounceTime(this.debounceTime)
      ).subscribe((response:BaseResponse)=>{
        if(response.success){         
          this.skuList = JSON.parse(response.data).contractSkuByMerchantId.items;
          this.totalCount = JSON.parse(response.data).contractSkuByMerchantId.totalCount;
           if(this.searchTerm == "")
            this.hasValidList.emit(this.skuList.length > 0);
        }
      });
    }
    else if(this.contractId){
      this.SkuService.getAllByContractId(this.itemStart-1, this.pageSize, this.searchTerm, this.contractId).pipe(
        debounceTime(this.debounceTime)
      ).subscribe((response:BaseResponse)=>{
        if(response.success){         
          this.skuList = JSON.parse(response.data).contractSKUByContractId.items;
          this.totalCount = JSON.parse(response.data).contractSKUByContractId.totalCount;
          if(this.searchTerm == "")
            this.hasInValidList.emit(this.skuList.length > 0);
        }
      });
    }
  }
  //Pagination Method End

  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private SkuService : SkuService,
    _merchantPermissionService : MerchantPermissionService,
    public utilityService: UtilityService) {    
      this.showEditSku = _merchantPermissionService.isMerchantEditor;  
      this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();    
  }

  ngOnInit(): void {
  }

  showSKUActions():boolean{
    return this.showEditSku ? true : false;
  }

  getUrl(contract : any) {
    return `merchants/contract/details/${contract.contractId}?merchantId=${this.merchant.merchantId}`
  }

  getDateOnly(date : string): Date{
    return new Date(date.slice(0, 10));
  }
 
navigateToSkuEdit(skuId : any, contract_Id:any): void {
    this._router.navigate(['merchants/sku/edit/' + skuId],    
    {
        queryParams: {
          contractId:contract_Id,
          merchantId: this.merchant?.merchantId ?? this.merchantId,
          action: this.contractId!=null && this.contractId > 0 ? this.CONTRACTDETAILS:this.MERCHANTDETAILS,
        }
      }
    );
  }

  navigateToEditGroupSku(skuId: number,merchantGroupId:number ){  
    this.SkuService.getMerchantByMerchantGroupId(merchantGroupId).pipe(
       debounceTime(this.debounceTime)
     ).subscribe((response:BaseResponse)=>{

    if(response.success){ 
      var merchantGroupMid= JSON.parse(response.data).merchants.items[0].merchantId;
        this._router.navigate(['merchants/merchant-group/sku/edit'],
        {
          queryParams: {
            merchantGroupMid: this.merchant?.merchantId ?? this.merchantId,
            skuId: skuId,
            merchantId:merchantGroupMid,
            action: this.contractId!=null && this.contractId > 0 ? this.CONTRACTDETAILS:this.MERCHANTDETAILS,
          },
          state: {
            contractId: this.contractId
            }
        });
      }
    });

  }

 }
