import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SKU_CONSTANTS } from '../constants/sku_constant';
import { ContractSKURequest } from '../models/contract-create-request';
import { BaseResponse } from '../services/base-response.model';
import { ContractService } from '../services/contract.service';
import { ProgramService } from '../services/program.service';
import { VoucherNumberRuleService } from '../services/voucher-number-rule.service';
import { TxcDateTimeService } from '@txc-angular/component-library';

@Directive({
  selector: '[appSkuBlukUpload]'
})
export class SkuBlukUploadDirective {

  fileUploader : HTMLElement;

  @Input('appSkuBlukUpload') appSkuBlukUpload: string | undefined;

  @Input() merchantId!: number;
  @Input() costSchemeId!:string;
  @Input() programId!:number;
  
  skuTypeList: any[] = SKU_CONSTANTS.SKU_TYPE;
  vnrList: any[] = [];

  constructor(
    private elementRef: ElementRef,
    public activeModal: NgbActiveModal,
    private renderer: Renderer2,
    private vnrService: VoucherNumberRuleService,    
    private readonly programService: ProgramService,
    private contractService: ContractService,
    private readonly _txcDateTimeService: TxcDateTimeService) {
      this.fileUploader = this.renderer.createElement('input');
      this.renderer.setAttribute(this.fileUploader, "hidden", "");
      this.renderer.setAttribute(this.fileUploader, "type", "file");
      this.renderer.setAttribute(this.fileUploader, "accept", ".xlsx");
      this.renderer.listen(this.fileUploader, 'change', (event) => {
        this.uploadFile(event);
      })

     }

    @HostListener('click', ['$event']) onClick($event : any){
      console.info('clicked: ' + $event);
      this.fileUploader.click();
  }

    ngOnInit() {
      this.getVnr();
      this.renderer.appendChild(this.elementRef.nativeElement, this.fileUploader);
    }

    /// <summary>
  /// call this method for the get voucher number rule details.
  /// </summary>
  getVnr(): any {
    if (this.vnrList.length == 0) {      
          this.programService.getProgramId(this.programId).subscribe(res => {
            let currentProgram = JSON.parse(res.data).programs.items[0];
            this.vnrService.getVoucherNumberRulesGraphQL(this.merchantId, currentProgram.isEdenred).subscribe(
              (res) => {
                this.vnrList = JSON.parse(res.data).voucherNumberRules.items;                
              });
          });
    }
  }

    /// <summary>
  /// This method for the sku details add to contract sku list.
  /// </summary>
  formatData(skuListData: any): ContractSKURequest[] { 
    let skuList: ContractSKURequest[] = [];
    if (skuListData.length > 0) {
      for (let index = 0; index < skuListData.length; index++) {
        
        let sku: ContractSKURequest = {
          
          skuName: skuListData[index].skuName,
          skuNumber: skuListData[index].skuNumber,
          skuTypeId: skuListData[index].skuTypeId,
          skuTypeText: this.skuTypeList.find(x => x.value == skuListData[index].skuTypeId).text,
          faceValueWithTax: skuListData[index].faceValueWithTax,
          voucherNumberRuleId: skuListData[index].voucherNumberRuleId,
          voucherNumberRuleText: this.vnrList.find(x => x.voucherNumberRuleId == skuListData[index].voucherNumberRuleId).ruleName,
          costWithTax: skuListData[index].costWithTax,
          validstartDate: this._txcDateTimeService.getUtcDateTime(new Date( `${skuListData[index].validStartDate.slice(0,10)} 00:00:00` )),
          validEndDate: this._txcDateTimeService.getUtcDateTime(new Date( `${skuListData[index].validEndDate.slice(0,10)} 23:59:59` )),
          multiplier: skuListData[index].multiplier,
        };
        skuList.push(sku);
      }
    }
    return skuList;
  }

    /// <summary>
  /// call this method when you want the upload to begin
  /// </summary>
  uploadFile(event: Event): void {
    const target: DataTransfer = <DataTransfer>(event.target as any);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const formRequestPayload = new FormData(); 
    const file: File = target.files[0];
    formRequestPayload.append("File", file, file.name);
    formRequestPayload.append("MerchantId", this.merchantId.toString());
    formRequestPayload.append("CostSchemeId", this.costSchemeId);
    this.contractService.uploadSku(formRequestPayload).subscribe(
      (data: BaseResponse) => {
        data.data.listSku = this.formatData(data.data.listSku);
        this.activeModal.close(data);
      },
      (err: any) => {
        let errorMessageskuValidation : string = "<ul class='m-0'>";
        if (err.error.data.skuValidationErrors != null && err.error.data.skuValidationErrors.length > 0) {
          for (let index = err.error.data.skuValidationErrors.length - 1; index >= 0; index--) {
            const element = err.error.data.skuValidationErrors[index].errorMessage.split(":");
            errorMessageskuValidation = errorMessageskuValidation + "<li><strong>" + element[0]  + ": </strong>" + (element.length > 1 ? element[1] : "") + "</li>";
          }
        }
        else {
          errorMessageskuValidation = errorMessageskuValidation + err.error.message;
        }
        errorMessageskuValidation = errorMessageskuValidation + "</ul>";
        let data : BaseResponse = {
          success : false,
          message : errorMessageskuValidation,
          data : ""
        } 
        this.activeModal.close(data);
      });      
  }

}
