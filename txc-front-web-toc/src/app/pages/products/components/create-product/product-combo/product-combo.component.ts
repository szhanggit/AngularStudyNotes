import { Component, OnInit } from '@angular/core';
import { SortableOptions } from 'sortablejs';
import { Product } from '../../../models/product.model';

const mockTestProductList: Product[] = [{
  productId: 1,
  productName: 'Test Product 01 e-Gift Voucher $500',
  productCode: 'ProductCode1',
  productType: 2,
  faceValueWithTax: 500
}, {
  productId: 2,
  productName: 'Test Product 02 e-Gift Voucher $500',
  productCode: 'ProductCode2',
  productType: 2,
  faceValueWithTax: 500
}, {
  productId: 3,
  productName: 'Test Product 03 e-Gift Voucher $500',
  productCode: 'ProductCode3',
  productType: 2,
  faceValueWithTax: 500
}];

@Component({
  selector: 'app-product-combo',
  templateUrl: './product-combo.component.html',
  styleUrls: ['./product-combo.component.scss']
})
export class ProductComboComponent implements OnInit {

  productList: Product[] = [];
  selectedProductList: Product[] = [];
  confirmProductList: Product[] = [];

  searchCollapsed = false;
  confirmCollapsed = true;
  rearrangeCollapsed = true;

  keyword: string;

  options: SortableOptions = {};
  
  constructor() { }

  ngOnInit(): void {
    this.options = {
      group: 'container2',
      handle: '.dragula-handle',
    }
  }
  
  expandContainer(container: string) {
    switch (container) {
      case 'confirm': {
        this.searchCollapsed = true;
        this.confirmCollapsed = false;
        this.rearrangeCollapsed = true;
        break;
      }
      case 'rearrange': {
        this.searchCollapsed = true;
        this.confirmCollapsed = true;
        this.rearrangeCollapsed = false;
        break;
      }
      default: {
        this.searchCollapsed = false;
        this.confirmCollapsed = true;
        this.rearrangeCollapsed = true;
        break;
      }
    }
  }

  populateProductList(): void {
    this.productList = mockTestProductList;
  }

  toggleCheckboxes(checked: boolean, step?: number): void {
    if (checked) {
      this.selectedProductList = [...this.productList];
    } else {
      this.selectedProductList = [];
    }

    for (let product of this.productList) {
      product.checked = checked;
    }

    if (step === 2) {
      this.expandContainer('search');
    }
  }

  addToSelectedProducts(checked: boolean, index: number): void {
    if (checked) {
      this.selectedProductList.push(this.productList[index]);
    } else {
      this.selectedProductList.splice(index, 1);
    }
  }

  addToCombo(): void {
    this.confirmProductList = [...this.selectedProductList];
    this.expandContainer('confirm');
  }
}
