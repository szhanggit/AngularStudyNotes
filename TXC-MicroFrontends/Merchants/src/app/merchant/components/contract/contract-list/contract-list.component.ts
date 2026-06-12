import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContractStatus } from 'src/app/merchant/enums/contract-status';
import { BaseResponse } from '../../../services/base-response.model';
import { ContractService } from '../../../services/contract.service';
import { debounceTime } from 'rxjs/operators';
import { Merchant } from '../../../models/merchant.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantPermissionService } from 'src/app/merchant/services/merchant-permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractModalAddSkuComponent } from '../contract-modal-add-sku/contract-modal-add-sku.component';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  @Input() merchant!: Merchant;
  @Input() valid!: boolean;
  @Output() hasList:EventEmitter<boolean>= new EventEmitter();

  contractStatus = ContractStatus;

  selectcontractStatus : any = 'All contract status';

  enumKeys : any[]=[];

  pageSize : number = 10;

  pageIndex : number = 1;

  searchTerm : string = "";


  contractList : any = [];

  totalCount : number = 0;

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

  constructor(private readonly _router: Router,
    private modalService: NgbModal,
    private contractService : ContractService,
    public _merchantPermissionService : MerchantPermissionService) {
    this.enumKeys=Object.values(this.contractStatus).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getData();
}

  getData(){
    if(this.selectcontractStatus==this.contractStatus.Expired)
    {
      this.valid=false; 
    }
    this.contractService.getAll(this.itemStart-1, this.pageSize, this.searchTerm, isNaN(this.selectcontractStatus) ? null : this.selectcontractStatus, this.valid, this.merchant.merchantId).pipe(
      debounceTime(3000)
    ).subscribe((response:BaseResponse)=>{
      if(response.success){
        this.contractList = JSON.parse(response.data).contracts.items;
        this.totalCount = JSON.parse(response.data).contracts.totalCount;
        if(this.searchTerm == "")
          this.hasList.emit(this.contractList.length > 0);
      }
    });
  }

  pageSizeChanged() : void {
    this.pageIndex = 1;
    this.getData() 
  }

  pageChange(){
    this.getData();
  }

  onSearchChange(){
    let wordSearch = this.searchTerm;
    setTimeout(() => {
        if (wordSearch == this.searchTerm) {
              this.getData();
        }
    }, 1000);
  }

  getContractStatusUI(status : string) : string{
    return this.contractService.getContractStatusCSS(status);
  }

  disableNeedReview(contract:any):boolean{
    return this._merchantPermissionService.isMerchantEditor ? contract.statusId != 2 : true;
  }
  disableAddSKU(contract:any):boolean{
    return  this._merchantPermissionService.isMerchantEditor ? contract.statusId != 1 && contract.statusId != 3 : true;
  }
  disableEditContract(contract:any):boolean{
    let endDate = Date.parse(contract.endDate);
    let startDate = Date.parse(contract.startDate);
    let currentDate = Date.parse((new Date()).toISOString());
    if(startDate > currentDate && endDate > currentDate)
      return this._merchantPermissionService.isMerchantEditor ? contract.statusId != 1 && contract.statusId != 3 && contract.statusId != 4 : true;
    else
      return true
  }
  disableEditContractPeriod(contract:any):boolean{
    let endDate = Date.parse(contract.endDate);
    let startDate = Date.parse(contract.startDate);
    let currentDate = Date.parse((new Date()).toISOString());
    if(startDate < currentDate && endDate > currentDate)
      return this._merchantPermissionService.isMerchantEditor ? contract.statusId != 3 : true;
    else
      return true
  }
  disableDuplicateContract(contract:any):boolean{
    return true;
    //below line commentted for future implementation.
    //return this._merchantPermissionService.isMerchantEditor ? contract.statusId != 3 : true;
  }

  navigateToAddSKU(contract : any) : void{
    
    this.contractService._setContract({
      merchantId : this.merchant.merchantId,
      contractId : contract.contractId,
      contractName : contract.contractName,
      contractNumber : contract.contractNumber,
      startDate : contract.startDate,
      endDate : contract.endDate,
      paymentTermId : contract.contractPaymentTerm.id,
      priceOptionId : contract.contractPriceOption.id,
      costSchemeId : contract.contractCostScheme.id,
      costPercentage : contract.costPercentage,
      costRoundingRuleId : contract.contractCostRoundingRule.id,
      costRoundingPlacesId : contract.contractCostRoundingPlaces.id,
    });

    const modalRef = this.modalService.open(ContractModalAddSkuComponent);
    modalRef.componentInstance.merchantId = this.merchant.merchantId;
    modalRef.componentInstance.contractId = contract.contractId;
    modalRef.componentInstance.programId = this.merchant.programId;
    modalRef.componentInstance.costSchemeId=contract.contractCostScheme.id;
    modalRef.componentInstance.contractStatus=contract.displayStatus;
    
    modalRef.result.then((data : BaseResponse) => {
      this.contractService._setContract({
        data : {
          success : data.success,
          message : data.message
        }
      });
      if(data.success){
        this.contractService._setContract({
          listSku : data.data.listSku
        });
      }
      this._router.navigate([`merchants/contract/${contract.contractId}/sku/create/draft/details`],
      {
        queryParams :{
          type : "bulk"
        }
      }
      );
      
    }, (reason) => {});
  }

  navigateToContractDetails(contract : any): void {
    this._router.navigateByUrl(this.getUrl(contract));
  }

  getUrl(contract : any) {
    return `merchants/contract/details/${contract.contractId}?merchantId=${this.merchant.merchantId}`
  }

  getDateOnly(date : string): Date{
    return new Date(date.slice(0, 10));
  }
}
