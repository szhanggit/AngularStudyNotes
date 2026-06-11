import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContractStatus } from 'src/app/core/enums/contract-status';
import { BaseResponse } from '../../../services/base-response.model';
import { ContractService } from '../../../services/contract.service';
import { debounceTime } from 'rxjs';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Merchant } from '../../../models/merchant.model';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

  @Input() merchant: Merchant;
  
  @Input() valid: boolean;

  @Output() hasList:EventEmitter<boolean>= new EventEmitter(); 

  contractStatus = ContractStatus;

  selectcontractStatus : any = 'All contract status';

  enumKeys : any[]=[];

  pageSize : number = 10;

  pageIndex : number = 1;

  searchTerm : string = "";


  contractList : any = [];

  totalCount : number = 0;

  userClaim = new UserAuthClaim(); 

  showAddSKU : boolean = false;

  showReview : boolean = false;

  showEditContract : boolean = false;

  showEditContractPeriod : boolean = false;

  showDuplicateContract : boolean = false;

  get itemStart() {
    return this.pageIndex === 1 ? 1 : this.totalCount < 1 ? this.totalCount : (((this.pageIndex - 1) * this.pageSize) + 1);
  }
  get itemEnd() {
    return this.pageIndex === this.pageCount || this.totalCount < this.pageIndex * this.pageSize ? this.totalCount : this.pageIndex * this.pageSize;
  }
  get pageCount() {
    return Math.ceil(this.totalCount / ( this.totalCount < this.pageSize ? this.totalCount : this.pageSize));
  }

  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private contractService : ContractService,
    private readonly authSvc: AuthService) {
    this.enumKeys=Object.values(this.contractStatus).filter(f => !isNaN(Number(f)));
    console.log("this.enumKeys", this.enumKeys);
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this._router.navigate(['account/error-404']);
        }
        this.userClaim = data;
        this.bindOprationPermission();
      });
  }

  bindOprationPermission() : void {
    if(this.userClaim.operations.length)
    {
      this.showReview = this.userClaim.operations.some(e => e === parseInt(environment.contract_review_op_id));
      this.showAddSKU = this.userClaim.operations.some(e => e === parseInt(environment.contract_add_sku_op_id));
      this.showEditContract = this.userClaim.operations.some(e => e === parseInt(environment.contract_edit_op_id));
      this.showEditContractPeriod = this.userClaim.operations.some(e => e === parseInt(environment.contract_edit_period_op_id));
      this.showDuplicateContract = this.userClaim.operations.some(e => e === parseInt(environment.contract_duplicate_op_id));
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.getData();
}

  getData(){
    console.log("selectcontractStatus", this.selectcontractStatus);
    this.contractService.getAll(this.itemStart-1, this.pageSize, this.searchTerm, isNaN(this.selectcontractStatus) ? null : this.selectcontractStatus, this.valid, this.merchant.merchantId).pipe(
      debounceTime(3000)
    ).subscribe((response:BaseResponse)=>{      
      if(response.success){
        console.log("response", response);
        this.contractList = JSON.parse(response.data).contracts.items;
        console.log("contractList", this.contractList);
        this.totalCount = JSON.parse(response.data).contracts.totalCount;
        this.hasList.emit(this.contractList.length > 0);  
      }
    });
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

  getContractStatusUI(statusId : number) : string{
    if(statusId == 1){
      return "badge bg-light text-dark p-1";  
    }
    else if(statusId == 2){
      return "badge bg-info text-dark p-1";  
    }
    else if(statusId == 3){
      return "badge bg-danger p-1";  
    }
    else if(statusId == 4){
      return "badge bg-info text-dark p-1";  
    }
    return "badge bg-primary p-1";
  }

  disableNeedReview(contract:any):boolean{
    return this.showReview ? contract.statusId != 2 : true;
  }
  disableAddSKU(contract:any):boolean{
    return  this.showAddSKU ? contract.statusId != 1 && contract.statusId != 4 : true;
  }
  disableEditContract(contract:any):boolean{
    return this.showEditContract ? contract.statusId != 1 && contract.statusId != 3 && contract.statusId != 4 : true;
  }
  disableEditContractPeriod(contract:any):boolean{
    return this.showEditContractPeriod ? contract.statusId != 4 : true;
  }
  disableDuplicateContract(contract:any):boolean{
    return this.showDuplicateContract ? contract.statusId != 4 : true;
  }

}
