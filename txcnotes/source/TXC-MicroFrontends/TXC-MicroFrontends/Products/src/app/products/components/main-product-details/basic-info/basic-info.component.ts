import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Dictionary } from 'src/app/products/models/dictionary.model';
import { DictionaryService } from 'src/app/products/services/dictionary.service';
import { MerchantService } from 'src/app/products/services/merchant.service';
import { Product } from '../../../models/product.model';
import { ProductCustomizationService } from '../../../services/product-customization.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit, OnChanges {
  @Input() product!: Product;
  @Input() selectedTenant: string = 'TW';
  resellerMerchantName: string = '';
  merchantAcquirers: Dictionary[] = [];

  constructor(public productCustomizationService: ProductCustomizationService,
    private merchantService: MerchantService,
    private _dictionaryService:DictionaryService
    ) { }

  ngOnInit(): void {
    if (this.selectedTenant === 'GL') {
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').subscribe(res => this.merchantAcquirers = JSON.parse(res.data).dictionaries)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['product']?.currentValue?.productIssuer == 2){
      this.merchantService.getMerchantById(this.product?.issueMerchant).subscribe(res => {
        let merchantDetails = res.data?.merchantDetails;
        this.resellerMerchantName =  merchantDetails?.find((data:any) => data.merchantId == this.product?.issueMerchant)?.merchantName! ?? '--';
      })
    }
  }

}
