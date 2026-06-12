import { Component, OnInit, Input } from '@angular/core';
import { ContractCostSchemeEnum } from 'src/app/products/enums/contract-cost-scheme.enum';
import { ProductTypeEnum } from 'src/app/products/enums/product-type.enum';
import { Merchant } from 'src/app/products/models/merchant.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { SKU } from 'src/app/products/models/sku.model';

@Component({
  selector: 'app-merchant-sku',
  templateUrl: './merchant-sku.component.html',
  styleUrls: ['./merchant-sku.component.scss'],
})
export class MerchantSkuComponent implements OnInit {
  @Input() selectedSKU!: SKU;
  @Input() selectedMerchant!: Merchant | undefined;
  @Input() selectedType!: ProductType;
  @Input() viewMode = false;
  @Input() isMonoMerchant = true;

  get type(): typeof ProductTypeEnum {
    return ProductTypeEnum;
  }

  get costSchemeType(): typeof ContractCostSchemeEnum {
    return ContractCostSchemeEnum;
  }

  get showPercentageWithCost(): boolean {
    return (
      this.selectedType.key === ProductTypeEnum.ValueBased ||
      this.selectedType.key === ProductTypeEnum.DynamicFaceValue
    );
  }

  constructor() {}

  ngOnInit(): void {}
}
