import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse } from 'src/app/merchant/services/base-response.model';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { MerchantPermissionService } from 'src/app/merchant/services/merchant-permission.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ContractModalEditPeriodComponent } from '../contract-modal-edit-period/contract-modal-edit-period.component';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ContractModalAddSkuComponent } from '../contract-modal-add-sku/contract-modal-add-sku.component';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { MerchantService } from 'src/app/merchant/services/merchant.service';



@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss']
})
export class ContractDetailsComponent implements OnInit {

  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  programId:number;
  merchantId: number;
  contractId: number;
  contract : any;
  action : string;
  message : string;
  showList : boolean = true;
  selectedTenantUTC!: string;

    // getter for contract status is Draft flag
    get isDraft(): boolean {
      return this.contract.statusId === 1;
    }

    // getter for contract status is Expired flag
    get isExpired(): boolean {
      let endDate = Date.parse(this.contract.endDate);
      let currentDate = Date.parse((new Date()).toISOString());
      return this.contract.statusId === 3 && endDate < currentDate;
    }

    // getter for contract status is Valid flag
    get isValid(): boolean {
      let endDate = Date.parse(this.contract.endDate);
      let currentDate = Date.parse((new Date()).toISOString());
      return this.contract.statusId === 3 && endDate > currentDate;
    }

    // getter for contract status is Future flag
    get isFuture(): boolean {
      let endDate = Date.parse(this.contract.endDate);
      let startDate = Date.parse(this.contract.startDate);
      let currentDate = Date.parse((new Date()).toISOString());
      return this.contract.statusId === 3 && startDate > currentDate && endDate > currentDate;
    }


    //Modal Start
  openModal(contractDetailsData:any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      centered:true
    };
    const contractDetails = {...contractDetailsData};
    const modalRef = this.modalService.open(ContractModalEditPeriodComponent,ngbModalOptions);
    modalRef.componentInstance.data = {
      title: 'Edit contract period',
      data: contractDetails,
      msg: "Modal",
      isFutureDate: this.isFuture,
      merchantId: this.merchantId,
    };
  }
  //Modal End

  constructor(private readonly _router: Router,
    private modalService: NgbModal,
    private readonly _route: ActivatedRoute,
    private contractService : ContractService,
    public _merchantPermissionService : MerchantPermissionService,
    private utilityService: UtilityService,
    private merchantService: MerchantService) { 
    this._router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
    }  
    const merchantIdFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.merchantId = merchantIdFromRoute ? Number.parseInt(merchantIdFromRoute) : 0;
    const contractIdFromRoute = this._route.snapshot.paramMap.get('id')
    this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;
    this.action = history.state?.action;
    this.message = history.state?.message;
    this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();

    this.programId = this.getProgramId();
  }


  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    if(this.action == "skuCreated" || this.action == "skuUpdated"){
      this.toast?.showSuccess(this.message)
    }
  }

  getData(): void{
    this.contractService.getByID(this.merchantId, this.contractId).subscribe((response:BaseResponse)=>{
      if(response.success){
        let data = JSON.parse(response.data).contracts.items;
        if(data.length > 0){
          this.contract = data[0];   
        }
      }
    })
  }

  goBack():void{
    this._router.navigate(['/merchants/details'],
      {
        queryParams :
          {
            merchantId : this.merchantId
          },
          state: {
            action: 'contractCancelled',
          }
          
        });
      }

  getContractStatusCSS(status : string) : string{
    return this.contractService.getContractStatusCSS(status);
  }

  hasList(event : boolean) : void{
    //alert(event);
    this.showList = event;
  }

  getDateOnly(date : string): Date{
    return new Date(date.slice(0, 10));
  }

  
   navigateToContractEdit(contract : any): void {
    this._router.navigate(['merchants/contract/edit/' + contract.contractId],    
   {
       queryParams: {
         merchantId: this.merchantId 
       }
     }
   );
  }
  navigateToAddSKU() : void{
    this.contractService._setContract({
      merchantId : this.merchantId,
      contractId : this.contract.contractId,
      contractName : this.contract.contractName,
      contractNumber : this.contract.contractNumber,
      startDate : this.contract.startDate,
      endDate : this.contract.endDate,
      paymentTermId : this.contract.contractPaymentTerm.id,
      priceOptionId : this.contract.contractPriceOption.id,
      costSchemeId : this.contract.contractCostScheme.id,
      costPercentage : this.contract.costPercentage,
      costRoundingRuleId : this.contract.contractCostRoundingRule.id,
      costRoundingPlacesId : this.contract.contractCostRoundingPlaces.id
    });

    const modalRef = this.modalService.open(ContractModalAddSkuComponent);
    modalRef.componentInstance.programId = this.programId;
    modalRef.componentInstance.merchantId = this.merchantId;
    modalRef.componentInstance.contractId = this.contractId;
    modalRef.componentInstance.costSchemeId = this.contract.contractCostScheme.id;
    modalRef.componentInstance.contractStatus = this.contract.displayStatus;
    modalRef.result.then((data) => {
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
      this._router.navigate([`merchants/contract/${this.contract.contractId}/sku/create/draft/details`],
      {
        queryParams :{
          type : "bulk"
        }
      }
      );

    }, (reason) => {});
  }

  /// <summary>
  /// call this method for the get program Id.
  /// </summary>
  getProgramId():any{
  this.merchantService.getMerchantById(this.merchantId).pipe(
    ).subscribe(
      (res: { data: { merchantDetails: { programId: number; }[]; }; }) => {          
        this.programId=res.data.merchantDetails[0].programId;
      });
}

}

//Modal Popup Prop for Open Mode
export enum OpenMode {
  view = 0,
  create = 1,
  edit = 2
}