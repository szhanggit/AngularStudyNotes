import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PRODUCT_CONSTANTS } from '../../../constants/product-constants';
import { ProductType } from '../../../models/product-type.model';
import { ProductCustomizationService } from '../../../services/product-customization.service';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class ProductTypeComponent implements OnInit {
  @Input() selectedType!: ProductType;
  @Input() selectedTenant!: string;
  @Output() productSelectedEvent = new EventEmitter<ProductType>();
  productTypes: ProductType[] = PRODUCT_CONSTANTS.PRODUCT_TYPE;
  selectProductTypes: ProductType[] = PRODUCT_CONSTANTS.SELECT_PRODUCT_TYPE;

  constructor(
    public productCustomizationService: ProductCustomizationService
  ) { }

  ngOnInit(): void {
  }

  selectType(productType: ProductType) {
    if (productType.key === this.selectedType.key) {
      return;
    }
    this.selectedType = productType;
    this.selectedType.isChild = false;

    this.productSelectedEvent.emit(productType);
  }

  showIsChildSelection(key: number) {
    return PRODUCT_CONSTANTS.PRODUCT_TYPE_EXCEPTION.includes(key);
  }
}
