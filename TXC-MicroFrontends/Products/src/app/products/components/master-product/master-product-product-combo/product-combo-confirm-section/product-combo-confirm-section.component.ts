import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/products/models/product.model';
import { ProductComboActionEnum, ProductComboProductTypeEnum } from '../master-product-product-combo.component';
import { ConfirmationModalComponent } from '@txc-angular/component-library';
import { MasterProductComboService, ProductComboErrorMessage } from 'src/app/products/services/master-product-combo.service';
import { SortingStatusEnum } from 'src/app/products/enums/sorting-status.enum';

@Component({
  selector: 'app-product-combo-confirm-section',
  templateUrl: './product-combo-confirm-section.component.html',
  styleUrls: ['./product-combo-confirm-section.component.scss']
})
export class ProductComboConfirmSectionComponent implements OnInit {
  @Input() parent!: any;
  @Input() productComboAction!: ProductComboActionEnum;
  @Input() productType!: ProductComboProductTypeEnum;
  @Output() addNewProductClicked = new EventEmitter();

  readonly STEP_NUMBER: number = 2;
  readonly TITLE = 'Confirm product list for this combo';
  readonly RESET_MODAL_TITLE = 'Reset product list';
  readonly RESET_MODAL_DESCRIPTION = 'Are you sure you want to reset? All product list will be cleared.';
  readonly RESET_MODAL_FIRST_BUTTON = 'Continue editing';
  readonly RESET_MODAL_SECOND_BUTTON = 'Reset';
  readonly ERROR_MESSAGE_NO_PRODUCT = 'Product code doesn\'t exist: ';
  readonly ERROR_MESSAGE_INACTIVE = 'Status is inactive: ';
  readonly ERROR_MESSAGE_NO_BRAND = 'No brand in product: ';
  readonly ERROR_MESSAGE_STOP_ISSUING = 'Product already stop issuing: ';
  readonly ERROR_MESSAGE_CANNOT_ADD_MASTER_PRODUCT = 'Master product can\'t be added into the combo: ';
  readonly ERROR_MESSAGE_ERROR = 'Error: ';
  readonly ERROR_MESSAGE_NO_SKU_COST = 'Product doesn\'t have SKU or SKU cost: ';
  readonly ERROR_MESSAGE_NO_VALID_SKU_COST = 'Product doesn\'t have valid SKU cost: ';
  readonly ERR_MSG_OPC_MULTIDFV_IN_BRANCH = 'More than 1 DFV under one brand.';
  readonly ERR_MSG_OPC_DFV_NOT_ADDED_TO_COMBO = 'DFV can\'t be added into SCV.';
  readonly CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_NAME = 'Product Name';
  readonly CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_CODE = 'Product Code';
  readonly CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_TYPE = 'Product Type';
  readonly CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX = 'Face Value With Tax';
  readonly CONFIRM_PRODUCT_TABLE_HEADER_BRAND_NAME = 'Brand Name';
  readonly CONFIRM_PRODUCT_TABLE_HEADER_ACTION = 'Action';
  readonly EXIST_PRODUCT_TABLE_HEADER_PRODUCT_NAME = 'Product Name';
  readonly EXIST_PRODUCT_TABLE_HEADER_PRODUCT_CODE = 'Product Code';
  readonly EXIST_PRODUCT_TABLE_HEADER_PRODUCT_TYPE = 'Product Type';
  readonly EXIST_PRODUCT_TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX = 'Face Value With Tax';
  readonly EXIST_PRODUCT_TABLE_HEADER_BRAND_NAME = 'Brand Name';

  existProductList!: Product[];
  confirmProductList!: Product[];

  confirmSortingMap = new Map<string, SortingStatusEnum>();
  existSortingMap = new Map<string, SortingStatusEnum>();
  sortingStatusEnum = SortingStatusEnum;
  stepFocused: boolean = false;
  sectionCollapsed: boolean = false;
  newProductsCollapsed: boolean = false;
  existProductsCollapsed: boolean = false;

  noCodeIdList = '';
  statusInactiveIdList = '';
  noBrandIdList = '';
  stopIssueIdList = '';
  masterProductIdList = '';
  noSkuIdList = '';
  noValidSkuCostIdList = '';
  errorMessage = '';

  get isErrorToast(): boolean {
    return this.noCodeIdList != '' ||
      this.statusInactiveIdList != '' ||
      this.noBrandIdList != '' ||
      this.stopIssueIdList != '' ||
      this.masterProductIdList != '' ||
      this.noSkuIdList != '' ||
      this.noValidSkuCostIdList != '' ||
      this.errorMessage != '';
  }

  get isSmartChoiceVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher;
  }

  get isSuperVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SuperVoucher;
  }

  get isInEditionAddProduct(): boolean {
    return this.productComboAction === ProductComboActionEnum.InEditionAddProduct;
  }

  get isInCreation(): boolean {
    return this.productComboAction === ProductComboActionEnum.InCreation;
  }

  constructor(
    private readonly modalService: NgbModal,
    private readonly masterProductComboService: MasterProductComboService
  ) {
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_NAME, SortingStatusEnum.None);
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_CODE, SortingStatusEnum.None);
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_TYPE, SortingStatusEnum.None);
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX, SortingStatusEnum.None);
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_BRAND_NAME, SortingStatusEnum.None);
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_ACTION, SortingStatusEnum.None);
    this.existSortingMap.set(this.EXIST_PRODUCT_TABLE_HEADER_PRODUCT_NAME, SortingStatusEnum.None);
    this.existSortingMap.set(this.EXIST_PRODUCT_TABLE_HEADER_PRODUCT_CODE, SortingStatusEnum.None);
    this.existSortingMap.set(this.EXIST_PRODUCT_TABLE_HEADER_PRODUCT_TYPE, SortingStatusEnum.None);
    this.existSortingMap.set(this.EXIST_PRODUCT_TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX, SortingStatusEnum.None);
    this.existSortingMap.set(this.EXIST_PRODUCT_TABLE_HEADER_BRAND_NAME, SortingStatusEnum.None);
  }

  ngOnInit(): void {
    this.parent.sectionStep$.subscribe((value: any) => {
      this.stepFocused = value === this.STEP_NUMBER;
      this.collapse(!this.stepFocused)
    });
    this.masterProductComboService.existProductList$.subscribe((value: any) => { this.existProductList = value });
    this.masterProductComboService.confirmProductList$.subscribe((value: any) => { this.confirmProductList = value });
    this.masterProductComboService.errorMessage$.subscribe((value: ProductComboErrorMessage) => {
      this.noCodeIdList = value.codeNotExist?.slice(0, -1) ?? '';
      this.stopIssueIdList = value.stopIssuing?.slice(0, -1) ?? '';
      this.noBrandIdList = value.noBrandInProduct?.slice(0, -1) ?? '';
      this.statusInactiveIdList = value.statusInactive?.slice(0, -1) ?? '';
      this.masterProductIdList = value.masterProductIncluded?.slice(0, -1) ?? '';
      this.noSkuIdList = value.noSkuCost?.slice(0, -1) ?? '';
      this.noValidSkuCostIdList = value.noValidSku?.slice(0, -1) ?? '';
      this.errorMessage = value.moreThanOneDFV ? this.ERR_MSG_OPC_MULTIDFV_IN_BRANCH : '';
      if (!this.errorMessage) this.errorMessage = value.DFVInSCV ? this.ERR_MSG_OPC_DFV_NOT_ADDED_TO_COMBO : '';
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

  onConfirmResetClick() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.title = this.RESET_MODAL_TITLE;
    modalRef.componentInstance.description = this.RESET_MODAL_DESCRIPTION;
    modalRef.componentInstance.firstButton = {
      buttonText: this.RESET_MODAL_FIRST_BUTTON,
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: this.RESET_MODAL_SECOND_BUTTON,
      buttonClass: 'btn-primary',
    };

    modalRef.result.then((res) => {
      if (res === 'confirm') {
        this.clearErrorToast();
        this.masterProductComboService.clearConfirmProduct();
        this.parent.sectionStep$.next(1);
        this.parent.isVerified_productCombo = false;
      }
    });
  }

  onConfirmClick(): void {
    let validationResult = false;
    this.clearErrorToast();
    if (this.parent.productType === ProductComboProductTypeEnum.SmartChoiceVoucher)
      validationResult = this.masterProductComboService.addConfirmProductsToRearrangeProduct();
    if (this.parent.productType === ProductComboProductTypeEnum.SuperVoucher)
      validationResult = this.masterProductComboService.addConfirmProductsToRearrangeBrand();

    if(validationResult) {
      this.parent.enableEditSaveButtonFlag();
      this.parent.sectionStep$.next(3);
    }
  }

  onNewProductsCollapseClick() {
    this.newProductsCollapsed = !this.newProductsCollapsed;
  }

  onExistProductsCollapseClick() {
    this.existProductsCollapsed = !this.existProductsCollapsed;
  }

  listSortingExistProductTable(tableName: string) {
    switch (tableName) {
      case this.EXIST_PRODUCT_TABLE_HEADER_PRODUCT_NAME: {
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
      case this.EXIST_PRODUCT_TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX: {
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
      case this.EXIST_PRODUCT_TABLE_HEADER_BRAND_NAME: {
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
    if (this.existSortingMap.get(tableName) === SortingStatusEnum.None ||
      this.existSortingMap.get(tableName) === SortingStatusEnum.Descending) {
      this.existSortingMap.set(tableName, SortingStatusEnum.Ascending);
    }
    else if (this.existSortingMap.get(tableName) === SortingStatusEnum.Ascending) {
      this.existProductList.reverse();
      this.existSortingMap.set(tableName, SortingStatusEnum.Descending);
    }
    // initialize other sorting status
    this.existSortingMap.forEach((item, key) => {
      if (key != tableName)
        this.existSortingMap.set(key, SortingStatusEnum.None);
    });
  }

  listSortingConfirmProductTable(tableName: string) {
    switch (tableName) {
      case this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_NAME: {
        this.confirmProductList.sort((a, b) => {
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
      case this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_FACE_VALUE_WITH_TAX: {
        this.confirmProductList.sort((a, b) => {
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
      case this.CONFIRM_PRODUCT_TABLE_HEADER_BRAND_NAME: {
        this.confirmProductList.sort((a, b) => {
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
    if (this.confirmSortingMap.get(tableName) === SortingStatusEnum.None ||
      this.confirmSortingMap.get(tableName) === SortingStatusEnum.Descending) {
      this.confirmSortingMap.set(tableName, SortingStatusEnum.Ascending);
    }
    else if (this.confirmSortingMap.get(tableName) === SortingStatusEnum.Ascending) {
      this.confirmProductList.reverse();
      this.confirmSortingMap.set(tableName, SortingStatusEnum.Descending);
    }
    // initialize other sorting status
    this.confirmSortingMap.forEach((item, key) => {
      if (key != tableName)
        this.confirmSortingMap.set(key, SortingStatusEnum.None);
    });
  }

  getExistProductTableSortingStatus(tableName: string): SortingStatusEnum {
    let status = SortingStatusEnum.None;
    this.existSortingMap.forEach((item, key) => {
      if (key === tableName)
        status = item;
    });
    return status;
  }

  getConfirmProductTableSortingStatus(tableName: string): SortingStatusEnum {
    let status = SortingStatusEnum.None;
    this.confirmSortingMap.forEach((item, key) => {
      if (key === tableName)
        status = item;
    });
    return status;
  }

  private clearErrorToast() {
    this.masterProductComboService.clearErrorToast();
  }

}
