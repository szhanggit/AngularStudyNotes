import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal, TxcDateTimeService } from '@txc-angular/component-library';
import { BaseResponse } from 'src/app/merchant/models/base-response.model';
import { ContractSKURequest, ContractBatchSku } from 'src/app/merchant/models/contract-create-request';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { SkuBlukReuploadModalComponent } from '../../contract/modals/sku-bluk-reupload-modal/sku-bluk-reupload-modal.component';

@Component({
  selector: 'app-sku-create-draft-details',
  templateUrl: './sku-create-draft-details.component.html',
  styleUrls: ['./sku-create-draft-details.component.scss']
})
export class SkuCreateDraftDetailsComponent implements OnInit {

  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  contract : any | undefined = undefined;
  skuData : any[] = [];
  type : string;
  programId : any;
  constructor(private router: Router,
    private readonly _routeactivate: ActivatedRoute,
    private modalService: NgbModal,
    private merchantService: MerchantService,
    private readonly _txcDateTimeService: TxcDateTimeService,
    private contractService : ContractService) {
      const typeFromRoute = this._routeactivate.snapshot.queryParams.type;
      this.type = typeFromRoute;    
   }

  ngOnInit(): void {
    this.bindData();
    this.getProgramId();
  }

  /// <summary>
  /// call this method for the get program Id.
  /// </summary>
  getProgramId():void{
  this.merchantService.getMerchantById(this.contract.merchantId).pipe(
    ).subscribe(
      (res: { data: { merchantDetails: { programId: number; }[]; }; }) => {          
        this.programId=res.data.merchantDetails[0].programId;
      });
}

  bindData():void{
    this.contract = this.contractService._getContract();
    this.skuData = this.contract.listSku;
    if(this.contract.contractId==undefined)
    {
      this.router.navigate(['merchants/contract/create'],
      {
      queryParams: 
      { 
        merchantId: this.contract.merchantId        
      } 
    });
  }   
    if(this.contract.merchantId == 0){
      this.router.navigate(['merchants']);
    }
  }

  openReupload() : void{  
    const modalRef = this.modalService.open(SkuBlukReuploadModalComponent);
    modalRef.componentInstance.programId = this.programId;
    modalRef.componentInstance.merchantId = this.contract.merchantId;
    modalRef.componentInstance.costSchemeId= this.contract.costSchemeId;
    modalRef.result.then((data : BaseResponse) => {  
      this.contractService._setContract({
        listSku : data.success ? data.data.listSku : [],
        data : {
          success : data.success,
          message : data.message
        }
      });      
      this.bindData();
    }, (reason) => {});
  }

  addSKU():void{
    this.router.navigate(['/merchants/contract/sku/create'], 
      {
        queryParams: 
        { 
          merchantId: this.contract.merchantId,
          contractId : this.contract.contractId,
          status : "Draft",
        } 
      });
  }

  onCancel():void{
    this.contractService._setContract({
      listSku : [],
    });
    this.router.navigate(['merchants/contract/details/' + this.contract.contractId],
    {
      queryParams: {
        merchantId: this.contract.merchantId
      }
    });
  }

  onSubmit(modalContent : any):void{
    
    let data : ContractBatchSku={
      contractId : this.contract.contractId,
      sku:[]
    }
    for (let index = 0; index < this.skuData.length; index++) {
      let element = <ContractSKURequest>this.skuData[index];     
        data.sku.push({
          skuName : element.skuName,
          skuNumber : element.skuNumber,
          skuTypeId : element.skuTypeId,
          voucherNumberRuleId : element.voucherNumberRuleId,
          faceValueWithTax : element.faceValueWithTax,
          multiplier : element.multiplier,
          costWithTax : element.costWithTax,
          validstartDate : element.validstartDate,
          validEndDate : element.validEndDate
        });
      
    }
    this.contractService.createBulkSku(data).subscribe((data : BaseResponse)=>{
      if(data.success){
        this.modalService.open(modalContent,  { backdrop : 'static',keyboard : false, ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result: any) => {
            this.router.navigate(['merchants/contract/details/' + this.contract.contractId],
            {
              queryParams: {
                merchantId: this.contract.merchantId
              },
              state : {
                action : "skuCreated",
                message : "SKU created successfully"
              }
            });
          },
          (reason: any) => {
            //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          },
        );
      }
      else{
        this.toast?.showDanger("Error :-" +data.message);
      }
      
    },
    (err : any)=>{
      if (err.error.data.skuValidationErrors != null && err.error.data.skuValidationErrors.length > 0) {
        for (let index = 0; index < err.error.data.skuValidationErrors.length; index++) {
          const element = err.error.data.skuValidationErrors[index];
          this.toast?.showDanger(element.errorMessage);
        }
      }      
    })
  }
}
