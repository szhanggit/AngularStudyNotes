import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { SkuService } from 'src/app/merchant/services/sku.service';
import { ContractSchemeEnum } from 'src/app/merchant/enums/merchant-group.enum';

@Component({
  selector: 'app-sku-draft-list',
  templateUrl: './sku-draft-list.component.html',
  styleUrls: ['./sku-draft-list.component.scss']
})
export class SkuDraftListComponent implements OnInit, OnChanges {

  @Input() merchantId!: number;
  @Input() contractId: number = 0;
  @Input() skuList!: any[];
  @Input() costscheme!: number;  
  @Input() isAfterBulkUploader!: boolean;
  @Input() showAction: boolean = true;

  skuListFormatted! : any[];
  contractStatus: string | null;
  constructor(private router : Router,
    private readonly _routeactivate: ActivatedRoute,
    private contractService: ContractService,
    public utilityService: UtilityService,
    public skuService : SkuService) { this.contractStatus = this._routeactivate.snapshot.queryParamMap.get('status'); 
    const contractIdFromRoute = this._routeactivate.snapshot.params.id;
    this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0; }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.skuList){
      this.formatSKUList();
    }
  }

  ngOnInit(): void {

  }

  /// <summary>
  /// This method for the formatting the SKU data list .
  /// </summary>
  formatSKUList(): void {
    this.skuListFormatted = [];
    for (let index = 0; index < this.skuList.length; index++) {
      let element = this.skuList[index];
      let indexElement = this.skuListFormatted.findIndex(x => x.skuNumber === element.skuNumber && x.skuName === element.skuName);
      if (indexElement < 0) {
        this.skuListFormatted.push({
          skuNumber: element.skuNumber,
          skuName: element.skuName,
          SKUCosts: []
        });
        indexElement = this.skuListFormatted.length - 1;
      }
      this.skuListFormatted[indexElement].SKUCosts.push({
        skuTypeText: element.skuTypeText,
        faceValueWithTax: element.faceValueWithTax,
        costWithTax: element.costWithTax,
        validstartDate: element.validstartDate,
        validEndDate: element.validEndDate,
        voucherNumberRuleText: element.voucherNumberRuleText
      })
    }
  }

  public get ContractSchemeEnum(){ return ContractSchemeEnum; }

  /// <summary>
  /// call this method for the remove the skudetails in skulist.
  /// </summary>
  removeSKU(index: number): void {
    let deleteElement = this.skuListFormatted[index];
    let firstIndex = this.skuList.findIndex(x => x.skuName == deleteElement.skuName && x.skuNumber == deleteElement.skuNumber);
    this.skuList.splice(firstIndex, deleteElement.SKUCosts.length);
    let data = this.contractService._getContract();
    data.listSku = this.skuList;
    this.contractService._setContract(data);
    this.formatSKUList();
  }

  navigateToSkuAdd(index: number): void {
    let element = this.skuListFormatted[index];
    let firstIndex = this.skuList.findIndex(x => x.skuName == element.skuName && x.skuNumber == element.skuNumber);
    let status  = (this.contractStatus == "DraftEdit" ? this.contractStatus : this.contractStatus == "Draft" ? this.contractStatus : null )
    this.router.navigate(['/merchants/contract/sku/create'], 
    { 
      queryParams: 
      { 
        merchantId: this.merchantId,
        contractId : this.contractId > 0 ? this.contractId : undefined,
        index: firstIndex,
        status : status
        
      } ,
      state: {
        data:this.isAfterBulkUploader       
      }
    }
    );
  }
  getCostWithTax(costWithTax: number){0
    return this.costscheme==1 ? costWithTax : (costWithTax.toFixed ? costWithTax.toFixed(4) : Number(costWithTax).toFixed(4));
  }
}
