import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortingStatusEnum } from 'src/app/products/enums/sorting-status.enum';
import { ProductComboUpdateRequest } from 'src/app/products/models/product-combo-update-request.model';
import { Product, ProductComboProperty } from 'src/app/products/models/product.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductComboService } from 'src/app/products/services/master-product-combo.service';
import { ProductComboActionEnum, ProductComboProductTypeEnum } from '../master-product-product-combo.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-combo-existing-section',
  templateUrl: './product-combo-existing-section.component.html',
  styleUrls: ['./product-combo-existing-section.component.scss']
})
export class ProductComboExistingSectionComponent implements OnInit {
  @Input() parent!: any;
  @Input() productComboAction!: ProductComboActionEnum;
  @Input() productType!: ProductComboProductTypeEnum;
  @Output() addNewProductClicked = new EventEmitter();

  readonly TITLE: string = 'Change status of existing product list';
  readonly PRODUCT_LIST_DEFAULT_SIZE: number = 5;
  readonly TABLE_HEADER_PRODUCT_NAME = 'Product Name';
  readonly TABLE_HEADER_PRODUCT_CODE = 'Product Code';
  readonly TABLE_HEADER_PRODUCT_TYPE = 'Product Type';
  readonly TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX = 'Face Value With Tax';
  readonly TABLE_HEADER_BRAND_NAME = 'Brand Name';
  readonly TABLE_HEADER_STATUS = 'Status';
  readonly RESET_MODAL_TITLE = 'Disable product';
  readonly RESET_MODAL_DESCRIPTION = 'Are you sure you want to disable this product?';
  readonly RESET_MODAL_FIRST_BUTTON = 'Cancel';
  readonly RESET_MODAL_SECOND_BUTTON = 'OK';
  readonly TOAST_ERROR_NO_PRODUCT_COMBO = 'Did not get initial product combo from master product service.';
  readonly TOAST_ERROR_UPDATE_PRODUCT_COMBO_STATUS = 'Error in updating product combo.';
  readonly TOAST_SUCCESS_UPDATE_PRODUCT_COMBO_STATUS = 'Product combo updated successfully.';

  existProductList!: Product[];
  existProductListDisplay: Product[] = [];
  sortingStatusEnum = SortingStatusEnum;
  sortingMap = new Map<string, SortingStatusEnum>();
  sectionCollapsed: boolean = false;

  get isSmartChoiceVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher;
  }

  get isSuperVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SuperVoucher;
  }

  constructor(
    private readonly masterProductComboService: MasterProductComboService
  ) {
    this.sortingMap.set(this.TABLE_HEADER_PRODUCT_NAME, SortingStatusEnum.None);
    this.sortingMap.set(this.TABLE_HEADER_PRODUCT_CODE, SortingStatusEnum.None);
    this.sortingMap.set(this.TABLE_HEADER_PRODUCT_TYPE, SortingStatusEnum.None);
    this.sortingMap.set(this.TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX, SortingStatusEnum.None);
    this.sortingMap.set(this.TABLE_HEADER_BRAND_NAME, SortingStatusEnum.None);
    this.sortingMap.set(this.TABLE_HEADER_STATUS, SortingStatusEnum.None);
  }

  ngOnInit(): void {
    this.masterProductComboService.existProductList$.subscribe((value) => {
      this.existProductList = value;
      this.toggleExistedProductList();
    });
  }

  collapse(collapsed?: boolean): void {
    if (collapsed != undefined) {
      this.sectionCollapsed = collapsed;
    }
    else {
      this.sectionCollapsed = !this.sectionCollapsed;
    }
  }

  onAddNewProductClick() {
    this.addNewProductClicked.emit();
  }

  toggleProductStatus(combo: ProductComboProperty, status: boolean, event?: any) {
    if (combo === undefined) {
      this.parent.toastDanger(this.TOAST_ERROR_NO_PRODUCT_COMBO);
      event.target.checked = !status;
      return;
    }
    combo.status = status ? 1 : 0;
    this.parent.enableEditSaveButtonFlag();
  }

  toggleExistedProductList() {
    if (this.existProductListDisplay.length !== this.PRODUCT_LIST_DEFAULT_SIZE) {
      this.existProductListDisplay = this.existProductList.slice(0, this.PRODUCT_LIST_DEFAULT_SIZE);
    }
    else {
      this.existProductListDisplay = this.existProductList;
    }
  }

  listSorting(tableName: string) {
    switch (tableName) {
      case this.TABLE_HEADER_PRODUCT_NAME: {
        this.existProductList.sort((a, b) => {
          const itemA = a.productName.toUpperCase();
          const itemB = b.productName.toUpperCase();
          if (itemA < itemB) {
            return -1;
          }
          if (itemA > itemB) {
            return 1;
          }
          return 0;
        });
        break;
      }
      case this.TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX: {
        this.existProductList.sort((a, b) => {
          const itemA = a.faceValueWithTax!;
          const itemB = b.faceValueWithTax!;
          if (itemA < itemB) {
            return -1;
          }
          if (itemA > itemB) {
            return 1;
          }
          return 0;
        });
        break;
      }
      case this.TABLE_HEADER_BRAND_NAME: {
        this.existProductList.sort((a, b) => {
          const itemA = a.brandName!.toUpperCase();
          const itemB = b.brandName!.toUpperCase();
          if (itemA < itemB) {
            return -1;
          }
          if (itemA > itemB) {
            return 1;
          }
          return 0;
        });
        break;
      }
    }
    // change sorting status
    if (this.sortingMap.get(tableName) === SortingStatusEnum.None ||
      this.sortingMap.get(tableName) === SortingStatusEnum.Descending) {
      this.sortingMap.set(tableName, SortingStatusEnum.Ascending);
    }
    else if (this.sortingMap.get(tableName) === SortingStatusEnum.Ascending) {
      this.existProductList.reverse();
      this.sortingMap.set(tableName, SortingStatusEnum.Descending);
    }
    // initialize other sorting status
    this.sortingMap.forEach((item, key) => {
      if (key != tableName)
        this.sortingMap.set(key, SortingStatusEnum.None);
    });
    // update display list
    this.existProductListDisplay = this.existProductList.slice(0, this.existProductListDisplay.length);
  }

  getSortingStatus(tableName: string): SortingStatusEnum {
    let status = SortingStatusEnum.None;
    this.sortingMap.forEach((item, key) => {
      if (key === tableName)
        status = item;
    });
    return status;
  }
}
