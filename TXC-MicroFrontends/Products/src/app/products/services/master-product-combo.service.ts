import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductComboBrand } from '../models/master-product/child-product.model';
import { MasterProductProductComboObject } from '../models/master-product/master-product.model';
import { Product } from '../models/product.model';
import { ProductComboProductTypeEnum } from '../components/master-product/master-product-product-combo/master-product-product-combo.component';

@Injectable({
  providedIn: 'root'
})
export class MasterProductComboService {

  private readonly DYNAMIC_FACE_VALUE_PRODUCT_TYPE = 4;

  public errorMessage$: Subject<ProductComboErrorMessage> = new Subject<ProductComboErrorMessage>();
  public confirmProductList$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public existProductList$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public rearrangeProductList$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public rearrangeBrandList$: BehaviorSubject<ProductComboBrand[]> = new BehaviorSubject<ProductComboBrand[]>([]);

  private errorMessageMemory: ProductComboErrorMessage = {};
  private sortedListMemory: MasterProductProductComboObject[] = [];

  confirmProductList: Product[] = [];
  existProductList: Product[] = [];
  rearrangeProductList: Product[] = [];
  rearrangeBrandList: ProductComboBrand[] = [];

  constructor(
  ) {
    this.confirmProductList$.subscribe((value) => { this.confirmProductList = value; });
    this.existProductList$.subscribe((value) => { this.existProductList = value; });
    this.rearrangeProductList$.subscribe((value) => { this.rearrangeProductList = value; });
    this.rearrangeBrandList$.subscribe((value) => { this.rearrangeBrandList = value; });
    this.errorMessage$.subscribe((value) => { this.errorMessageMemory = value });
  }

  initializeExistProduct(productList: Product[]) {
    this.sortedListMemory = [];
    this.existProductList$.next(productList);
  }

  initializeConfirmProduct(productList: Product[]) {
    this.sortedListMemory = [];
    this.confirmProductList$.next(productList);
  }

  initializeRearrangeProductListInCreate(sortedList: MasterProductProductComboObject[]) {
    this.sortedListMemory = sortedList;
    sortedList.forEach((item) => {
      const sp = this.confirmProductList.find((p) => p.productId === item.childProductId);
      if (sp) this.rearrangeProductList.push(sp);
    });
  }

  initializeRearrangeProductListInEdit(sortedList: MasterProductProductComboObject[]) {
    this.sortedListMemory = sortedList;
    sortedList.forEach((item) => {
      const sp = this.existProductList.find((p) => p.productId === item.childProductId);
      if (sp) this.rearrangeProductList.push(sp);
    });
  }

  initializeRearrangeBrandListInCreate(sortedList: MasterProductProductComboObject[]) {
    this.sortedListMemory = sortedList;
    sortedList.forEach((item) => {
      const sp = this.confirmProductList.find(
        (p) => p.productId == item.childProductId
      );
      if (sp) {
        if (!this.rearrangeBrandList.find((b) => b.brandName === sp.brandName)) {
          this.rearrangeBrandList.push({
            brandName: sp.brandName,
            quantity: 1,
          } as ProductComboBrand);
        } else {
          this.rearrangeBrandList.find(
            (b) => b.brandName === sp.brandName
          )!.quantity++;
        }
      }
    })
  }

  initializeRearrangeBrandListInEdit(sortedList: MasterProductProductComboObject[]) {
    this.sortedListMemory = sortedList;
    sortedList.forEach((item) => {
      const sp = this.existProductList.find((p) => p.productId === item.childProductId);
      if (sp) {
        if (!this.rearrangeBrandList.find((b) => b.brandName === sp.brandName)) {
          this.rearrangeBrandList.push({
            brandName: sp.brandName,
            quantity: 1,
          } as ProductComboBrand);
        } else {
          this.rearrangeBrandList.find(
            (b) => b.brandName === sp.brandName
          )!.quantity++;
        }
      }
    });
  }

  addProductsByCodeToConfirmProductList(productList: Product[], codes: string[], type: ProductComboProductTypeEnum) {
    this.errorMessage$.next({});
    productList.forEach((item) => {
      if (this.validateProduct(item, type) &&
        this.confirmProductList.find((p) => p.productCode === item.productCode) === undefined &&
        this.existProductList.find((p) => p.productCode === item.productCode) === undefined) {
        this.confirmProductList.push(item);
      }
    });
    codes.forEach((code) => {
      if (productList.find((item) => item.productCode === code) === undefined) {
        this.addNonExistCodeError(code);
      }
    });

    this.confirmProductList$.next(this.confirmProductList);
  }

  addSelectProductsToConfirmProductList(productList: Product[], type: ProductComboProductTypeEnum) {
    this.errorMessage$.next({});
    productList.forEach((item) => {
      if (this.validateProduct(item, type) &&
        this.confirmProductList.find((p) => p.productCode === item.productCode) === undefined &&
        this.existProductList.find((p) => p.productCode === item.productCode) === undefined) {
        this.confirmProductList.push(item);
      }
    });
    this.confirmProductList$.next(this.confirmProductList);
  }

  addConfirmProductsToRearrangeProduct(): boolean {
    // validation
    if (!this.validateProductListSmartChoiceVoucher()) return false;

    this.confirmProductList.forEach((item) => {
      if (this.rearrangeProductList.find((p) => p.productCode === item.productCode) === undefined) {
        this.rearrangeProductList.push(item);
      }
    });
    this.rearrangeProductList.forEach((item, index) => {
      if (this.confirmProductList.findIndex(p => p.productCode === item.productCode) === -1)
        if (this.existProductList.findIndex(p => p.productCode === item.productCode) === -1)
          this.rearrangeProductList.splice(index, 1);
    });
    this.rearrangeProductList$.next(this.rearrangeProductList);
    return true;
  }

  addConfirmProductsToRearrangeBrand(): boolean {
    // validation
    if (!this.validateProductListSuperVoucher()) return false;

    this.confirmProductList.forEach((item) => {
      if (!this.rearrangeBrandList.find((b) => b.brandName === item.brandName)) {
        this.rearrangeBrandList.push({
          brandName: item.brandName,
          quantity: 1,
        } as ProductComboBrand);
      }
    });
    this.rearrangeBrandList.forEach((item, index) => {
      item.quantity = this.confirmProductList.filter(p => p.brandName === item.brandName).length +
        this.existProductList.filter(p => p.brandName === item.brandName).length;
      if (item.quantity === 0)
        this.rearrangeBrandList.splice(index, 1);
    });

    this.rearrangeBrandList$.next(this.rearrangeBrandList);
    return true;
  }

  clearConfirmProduct() {
    this.confirmProductList$.next([]);
    if (this.rearrangeBrandList.length > 0) {
      this.rearrangeBrandList$.next([]);
      if (this.existProductList.length > 0) {
        this.initializeRearrangeBrandListInEdit(this.sortedListMemory);
      }
    }
    if (this.rearrangeProductList.length > 0) {
      this.rearrangeProductList$.next([]);
      if (this.existProductList.length > 0) {
        this.initializeRearrangeProductListInEdit(this.sortedListMemory);
      }
    }
  }

  clearErrorToast() {
    this.errorMessage$.next({});
  }

  private validateProduct(product: Product, type: ProductComboProductTypeEnum): boolean {
    if (product.productType === 5 || product.productType === 8 || product.multipleSelectionType === 1) {
      if (!this.errorMessageMemory.masterProductIncluded) this.errorMessageMemory.masterProductIncluded = '';
      this.errorMessageMemory.masterProductIncluded += product.productCode + ',';
      this.errorMessage$.next(this.errorMessageMemory);
      return false;
    }
    if (product.status === 0) {
      if (!this.errorMessageMemory.statusInactive) this.errorMessageMemory.statusInactive = '';
      this.errorMessageMemory.statusInactive += product.productCode + ',';
      this.errorMessage$.next(this.errorMessageMemory);
      return false;
    }
    if (!product.brandName && type === ProductComboProductTypeEnum.SuperVoucher) {
      if (!this.errorMessageMemory.noBrandInProduct) this.errorMessageMemory.noBrandInProduct = '';
      this.errorMessageMemory.noBrandInProduct += product.productCode + ',';
      this.errorMessage$.next(this.errorMessageMemory);
      return false;
    }
    if (product.stopIssueTime && new Date(product.stopIssueTime) <= new Date()) {
      if (!this.errorMessageMemory.stopIssuing) this.errorMessageMemory.stopIssuing = '';
      this.errorMessageMemory.stopIssuing += product.productCode + ',';
      this.errorMessage$.next(this.errorMessageMemory);
      return false;
    }
    if (!(product.contractSku) || !(product.contractSku.contractSKUCosts?.length > 0)) {
      if (!this.errorMessageMemory.noSkuCost) this.errorMessageMemory.noSkuCost = '';
      this.errorMessageMemory.noSkuCost += product.productCode + ',';
      this.errorMessage$.next(this.errorMessageMemory);
      return false;
    }
    if (product.contractSku && product.contractSku.contractSKUCosts?.length > 0) {
      const skuCosts = product.contractSku.contractSKUCosts;
      let validTarget = undefined;
      skuCosts.forEach((cost: any) => {
        if (cost.costWithoutTax && cost.validStartDate && cost.validEndDate && cost.statusId) {
          if (!isNaN(Date.parse(cost.validStartDate)) && !isNaN(Date.parse(cost.validEndDate))) {
            const today: string = new Date().toISOString();
            // ongoing peroid
            const ongoingSkuCosts = skuCosts
              .filter((x: any) => Date.parse(x.validStartDate) <= Date.parse(today) && Date.parse(today) <= Date.parse(x.validEndDate));
            // future preriod
            const futureSkuCosts = skuCosts
              .filter((x: any) => Date.parse(today) < Date.parse(x.validStartDate))
              .sort((a: any, b: any) => {
                if (Date.parse(a.validStartDate) == Date.parse(b.validStartDate)) return 0;
                if (Date.parse(a.validStartDate) < Date.parse(b.validStartDate)) return -1;
                return 1;
              });
            if (futureSkuCosts && futureSkuCosts.length > 0) validTarget = futureSkuCosts[0];
            if (ongoingSkuCosts && ongoingSkuCosts.length > 0) validTarget = ongoingSkuCosts[0];
          }
        }
      });
      if (!validTarget) {
        if (!this.errorMessageMemory.noValidSku) this.errorMessageMemory.noValidSku = '';
        this.errorMessageMemory.noValidSku += product.productCode + ',';
        this.errorMessage$.next(this.errorMessageMemory);
        return false;
      }
    }
    return true;;
  }

  validateProductListSmartChoiceVoucher(): boolean {
    this.errorMessageMemory.DFVInSCV = this.confirmProductList.filter(product => product.productType === this.DYNAMIC_FACE_VALUE_PRODUCT_TYPE).length != 0;
    this.errorMessage$.next(this.errorMessageMemory);
    return !this.errorMessageMemory.DFVInSCV;
  }

  validateProductListSuperVoucher(): boolean {
    let result = false;
    const hashSet = new Map();
    this.confirmProductList.forEach((item) => {
      if (item.productType === this.DYNAMIC_FACE_VALUE_PRODUCT_TYPE) {
        if (hashSet.has(item.brandName)) {
          result = true;
        }
        else
          hashSet.set(item.brandName, true);
      }
    });
    this.existProductList.forEach((item) => {
      if (item.productType === this.DYNAMIC_FACE_VALUE_PRODUCT_TYPE) {
        if (hashSet.has(item.brandName)) {
          result = true;
        }
        else
          hashSet.set(item.brandName, true);
      }
    });

    this.errorMessageMemory.moreThanOneDFV = result;
    this.errorMessage$.next(this.errorMessageMemory);
    return !result;
  }

  private addNonExistCodeError(code: string): void {
    if (!this.errorMessageMemory.codeNotExist) this.errorMessageMemory.codeNotExist = '';
    if (!this.errorMessageMemory.statusInactive?.includes(code) &&
      !this.errorMessageMemory.noBrandInProduct?.includes(code) &&
      !this.errorMessageMemory.stopIssuing?.includes(code) &&
      !this.errorMessageMemory.masterProductIncluded?.includes(code) &&
      !this.errorMessageMemory.noSkuCost?.includes(code) &&
      !this.errorMessageMemory.noValidSku?.includes(code)) {
      this.errorMessageMemory.codeNotExist += code + ',';
      this.errorMessage$.next(this.errorMessageMemory);
    }
  }
}

export interface ProductComboErrorMessage {
  codeNotExist?: string,
  statusInactive?: string,
  noBrandInProduct?: string,
  stopIssuing?: string,
  masterProductIncluded?: string,
  noSkuCost?: string,
  noValidSku?: string,
  moreThanOneDFV?: boolean,
  DFVInSCV?: boolean,
}
