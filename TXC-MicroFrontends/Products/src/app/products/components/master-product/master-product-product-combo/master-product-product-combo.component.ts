import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionMode,
  MasterProduct,
  MasterProductProductCombo,
  MasterProductProductComboObject,
} from 'src/app/products/models/master-product/master-product.model';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { Product } from '../../../models/product.model';
import { ProductComboBrand } from 'src/app/products/models/master-product/child-product.model';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductComboService } from 'src/app/products/services/master-product-combo.service';
import { ProductComboUpdateRequest } from 'src/app/products/models/product-combo-update-request.model';

@Component({
  selector: 'app-master-product-product-combo',
  templateUrl: './master-product-product-combo.component.html',
  styleUrls: ['./master-product-product-combo.component.scss'],
})
export class MasterProductProductComboComponent implements OnInit {

  @Input() parent!: any;

  readonly STEP = 2;
  readonly PRODUCT_KEY_SCV = 5;
  readonly PRODUCT_KEY_SV = 8;
  readonly REARRAGE_STEP = 3;
  readonly TOAST_ERROR_NO_MASTER_PRODUCT = 'Did not get initial product data from master product service.';
  readonly TOAST_ERROR_GET_PRODUCT_INFORMATION = 'Error in getting the product data.';
  readonly TOAST_ERROR_UPDATE_PRODUCT_COMBO_STATUS = 'Error in updating product combo.';

  public sectionStep$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  destroy$ = new Subject();

  confirmProductList: Array<Product> = [];
  existProductList: Array<Product> = [];
  rearrangeProductList: Array<Product> = [];
  rearrangeBrandList: Array<ProductComboBrand> = [];

  originalChildProductIdSet: Set<number> = new Set();

  masterProduct?: MasterProduct;
  productComboAction?: ProductComboActionEnum;
  productType?: ProductComboProductTypeEnum;

  get isVisibleExistingSection(): boolean {
    return this.productComboAction === ProductComboActionEnum.InEditionView
  }

  get isVisibleSearchSection(): boolean {
    return this.productComboAction === ProductComboActionEnum.InCreation || this.productComboAction === ProductComboActionEnum.InEditionAddProduct
  }

  get isVisibleConfirmSection(): boolean {
    return this.productComboAction === ProductComboActionEnum.InCreation || this.productComboAction === ProductComboActionEnum.InEditionAddProduct
  }

  constructor(
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly masterProductComboService: MasterProductComboService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.initializeUrl();
    this.sectionStep$.next(1);
    this.initializeSubject();
    this.initializeProductComboAction();
    this.initializeMasterProductService();
    this.validateComboData();
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.disableEditSaveButtonFlag();
    });
  }

  ngOnDestroy(): void {
    this.clearCacheInMasterProductComboService();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  // initialize

  private initializeUrl() {
    if (this.parent.wizardKey && !this.activatedRoute.snapshot.queryParams['wizardKey']) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          wizardKey: this.parent.wizardKey
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  private initializeSubject() {
    this.masterProductComboService.confirmProductList$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.confirmProductList = value;
    });
    this.masterProductComboService.existProductList$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.existProductList = value;
    });
    this.masterProductComboService.rearrangeProductList$.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      this.rearrangeProductList = value;
      this.validateComboData();
    });
    this.masterProductComboService.rearrangeBrandList$.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      this.rearrangeBrandList = value;
      this.validateComboData();
    });
    this.sectionStep$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      if ((this.productComboAction === ProductComboActionEnum.InCreation ||
        this.productComboAction === ProductComboActionEnum.InEditionAddProduct) &&
        step != this.REARRAGE_STEP) {
        this.disableEditSaveButtonFlag();
        this.disableProductComboVerified();
      }
    });
  }

  private initializeProductComboAction() {
    if (this.parent.actionMode === ActionMode.Create)
      this.productComboAction = ProductComboActionEnum.InCreation;
    if (this.parent.actionMode === ActionMode.Edit)
      this.productComboAction = ProductComboActionEnum.InEditionView;
    if (this.parent.productType.key === this.PRODUCT_KEY_SCV)
      this.productType = ProductComboProductTypeEnum.SmartChoiceVoucher;
    if (this.parent.productType.key === this.PRODUCT_KEY_SV)
      this.productType = ProductComboProductTypeEnum.SuperVoucher;
  }

  private initializeMasterProductService() {
    if (this.parent.actionMode === ActionMode.Create && this.parent.wizardKey)
      this.getProductWizard();
    if (this.parent.actionMode === ActionMode.Edit && this.parent.productId)
      this.getMasterProductCombo();
    this.subscribeNextStepEvent();
  }

  private validateComboData(): boolean {
    if (!this.parent) return false;
    if (this.parent.step === this.STEP) {
      this.parent.isVerified_productCombo = false;
      if (this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher &&
        this.rearrangeProductList.length > 0 &&
        this.masterProductComboService.validateProductListSmartChoiceVoucher())
        this.parent.isVerified_productCombo = true;
      if (this.productType === ProductComboProductTypeEnum.SuperVoucher &&
        this.rearrangeBrandList.length > 0 &&
        this.masterProductComboService.validateProductListSuperVoucher())
        this.parent.isVerified_productCombo = true;
    }
    return this.parent.isVerified_productCombo;
  }

  private getProductWizard() {
    this.masterProductApiService.getProductWizard(this.parent.wizardKey).subscribe({
      next: (res) => {
        if (res.success) {
          this.masterProduct = this.masterProductService.wizardDataToMasterProduct(this.parent.wizardKey!, res.data);
          if (
            this.masterProduct.masterProductProductCombo?.productComboList
          ) {
            const ids = this.masterProduct.masterProductProductCombo.productComboList.map((item) => item.childProductId);
            if (ids) ids.forEach(id => this.originalChildProductIdSet.add(id!));
            this.masterProductApiService.getProductInfoByProductIdList(ids).subscribe({
              next: (res) => {
                if (res.success) {
                  const data = JSON.parse(res.data);
                  const productList: Product[] = this.masterProductService.convertProductInfoDataToProductList(data);
                  const sortedList: MasterProductProductComboObject[] = this.masterProduct!.masterProductProductCombo!.productComboList!.sort(
                    (a: any, b: any) => { return (a.sequence ?? 0) - (b.sequence ?? 0); }
                  );
                  // set data into list
                  this.masterProductComboService.initializeConfirmProduct(productList);
                  if (this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher)
                    this.masterProductComboService.initializeRearrangeProductListInCreate(sortedList);
                  if (this.productType === ProductComboProductTypeEnum.SuperVoucher)
                    this.masterProductComboService.initializeRearrangeBrandListInCreate(sortedList);
                  // go to the last section
                  this.sectionStep$.next(3);
                }
              },
              error: (msg) => {
                this.toastDanger(this.TOAST_ERROR_GET_PRODUCT_INFORMATION);
              },
              complete: () => {
                this.validateComboData();
              },
            });
          }
        } else {
          this.toastDanger(this.TOAST_ERROR_GET_PRODUCT_INFORMATION);
        }
      },
      error: (msg) => {
        this.toastDanger(this.TOAST_ERROR_GET_PRODUCT_INFORMATION);
      },
      complete: () => { },
    });
  }

  private getMasterProductCombo() {
    this.masterProductApiService.getMasterProductCombo(this.parent.productId).subscribe({
      next: (res) => {
        if (res.success) {
          this.masterProduct = this.masterProductService.convertProductComboDataToMasterProduct(res.data);
          const childProductVersionIds = res.data.map((item: any) => item.childProductVersionId);
          this.masterProductApiService.getProductVersionsByIdList(childProductVersionIds).subscribe({
            next: (productVersionsRes) => {
              if (productVersionsRes.success) {
                const productVersionsData = JSON.parse(productVersionsRes.data);
                const productList: Product[] = this.masterProductService.convertProductVersionsDataToProductList(productVersionsData, res.data);
                const sortedList = this.masterProduct!.masterProductProductCombo!.productComboList!.sort(
                  (a, b) => { return (a.sequence ?? 0) - (b.sequence ?? 0); }
                );
                // set data into list
                this.masterProductComboService.initializeExistProduct(productList);
                if (this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher)
                  this.masterProductComboService.initializeRearrangeProductListInEdit(sortedList);
                if (this.productType === ProductComboProductTypeEnum.SuperVoucher)
                  this.masterProductComboService.initializeRearrangeBrandListInEdit(sortedList);
                // go to the last section
                this.sectionStep$.next(3);
              }
            },
            error: (msg) => {
              this.toastDanger(this.TOAST_ERROR_GET_PRODUCT_INFORMATION);
            },
            complete: () => {
            },
          });
        }
        else {
          this.toastDanger(this.TOAST_ERROR_GET_PRODUCT_INFORMATION);
        }
      },
      error: (msg) => {
        this.toastDanger(this.TOAST_ERROR_GET_PRODUCT_INFORMATION);
      },
      complete: () => { }
    });
  }

  private subscribeNextStepEvent() {
    this.masterProductService.nextStep$
      .pipe(
        filter((stepper) => stepper !== this.STEP),
        takeUntil(this.destroy$)
      )
      .subscribe((x) => {
        this.onStepChange();
      });
  }

  private onStepChange() {
    if (this.productComboAction === ProductComboActionEnum.InCreation && this.parent.wizardKey && this.validateComboData()) {
      this.onPushDataToWizard(this.parent.wizardKey);
    }

    if (this.productComboAction === ProductComboActionEnum.InEditionView || this.productComboAction === ProductComboActionEnum.InEditionAddProduct) {
      this.onPushDataToUpdateCombo();
    }
  }

  private onPushDataToWizard(wizardKey: string) {
    if (this.masterProduct == null) {
      this.parent.toastDanger(this.TOAST_ERROR_NO_MASTER_PRODUCT);
      return;
    }

    let data: MasterProductProductCombo = { productComboList: [] };
    if (this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher) {
      this.rearrangeProductList.forEach((product, index) => {
        data.productComboList?.push({
          childProductId: product.productId,
          childProductVersionId: product.currentProductVersionId,
          status: 1,
          sequence: index + 1
        });
      });
    }
    if (this.productType === ProductComboProductTypeEnum.SuperVoucher) {
      this.rearrangeBrandList.forEach((brand, index) => {
        this.confirmProductList
          .filter((p) => p.brandName === brand.brandName)
          .forEach((product) => {
            data.productComboList?.push({
              childProductId: product.productId,
              childProductVersionId: product.currentProductVersionId,
              status: 1,
              sequence: index + 1
            });
          });
      });
    }
    this.masterProduct.wizardKey = wizardKey;
    this.masterProduct.masterProductProductCombo = data;

    this.masterProductService.pushMasterProduct(this.masterProduct, this.STEP);
  }

  private isComboListChanged(): boolean {
    if (this.originalChildProductIdSet.size === 0) return false;
    if (this.masterProduct?.masterProductProductCombo?.productComboList) {
      for (let item of this.masterProduct.masterProductProductCombo.productComboList) {
        if (!this.originalChildProductIdSet.has(item.childProductId!)) return true;
        this.originalChildProductIdSet.delete(item.childProductId!);
      }
    }
    if (this.originalChildProductIdSet.size != 0) return true;

    return false;
  }

  private onPushDataToUpdateCombo() {
    const body: ProductComboUpdateRequest = {
      productComboList: []
    };
    if (this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher) {
      this.rearrangeProductList.forEach((product, index) => {
        // existed product
        if (product.productCombo)
          body.productComboList.push({
            productComboId: product.productCombo.productComboId,
            productId: this.parent.productId,
            childProductId: product.productCombo.childProductId,
            childProductVersionId: product.productCombo.childProductVersionId,
            sequence: index + 1,
            status: product.productCombo.status
          });
        // new product
        if (!product.productCombo)
          body.productComboList.push({
            productId: this.parent.productId,
            childProductId: product.productId,
            childProductVersionId: product.currentProductVersionId,
            sequence: index + 1,
            status: 1
          });
      });
    }
    if (this.productType === ProductComboProductTypeEnum.SuperVoucher) {
      this.rearrangeBrandList.forEach((brand, index) => {
        // existed product
        this.existProductList
          .filter((p) => p.brandName === brand.brandName)
          .forEach((product) => {
            body.productComboList?.push({
              productComboId: product.productCombo!.productComboId,
              productId: this.parent.productId,
              childProductId: product.productCombo!.childProductId,
              childProductVersionId: product.productCombo!.childProductVersionId,
              sequence: index + 1,
              status: product.productCombo!.status
            });
          });
        // new product
        this.confirmProductList
          .filter((p) => p.brandName === brand.brandName)
          .forEach((product) => {
            body.productComboList?.push({
              productId: this.parent.productId,
              childProductId: product.productId,
              childProductVersionId: product.currentProductVersionId,
              sequence: index + 1,
              status: 1
            });
          });
      });
    }
    this.masterProductApiService.updateProductCombo(body).subscribe({
      next: (res) => {
        if (res.success) {
          this.parent.notifyUpdateSuccess();
        }
        else
          this.parent.toastDanger(this.TOAST_ERROR_UPDATE_PRODUCT_COMBO_STATUS);
      },
      error: (err) => {
        this.parent.toastDanger(this.TOAST_ERROR_UPDATE_PRODUCT_COMBO_STATUS);
      },
      complete: () => { }
    });
  }

  private clearCacheInMasterProductComboService() {
    this.masterProductComboService.confirmProductList$.next([]);
    this.masterProductComboService.existProductList$.next([]);
    this.masterProductComboService.rearrangeProductList$.next([]);
    this.masterProductComboService.rearrangeBrandList$.next([]);
  }

  // event handlers

  addNewProductsClickEventHandler(): void {
    this.productComboAction = ProductComboActionEnum.InEditionAddProduct;
    this.sectionStep$.next(1);
  }

  // methods for children

  toastDanger(data: string) {
    this.parent.toastDanger(data);
  }

  toastSuccess(data: string) {
    this.parent.toastSuccess(data);
  }

  disableProductComboVerified() {
    this.parent.isVerified_productCombo = false;
  }

  enableProductComboVerified() {
    this.parent.isVerified_productCombo = true;
  }

  disableEditSaveButtonFlag() {
    this.parent.editSaveButtonDisableFlag$.next(true);
  }

  enableEditSaveButtonFlag() {
    if (this.productComboAction === ProductComboActionEnum.InEditionView)
      this.parent.editSaveButtonDisableFlag$.next(false);
    if ((this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher &&
      this.masterProductComboService.validateProductListSmartChoiceVoucher()) ||
      (this.productType === ProductComboProductTypeEnum.SuperVoucher &&
        this.masterProductComboService.validateProductListSuperVoucher())) {
      if (this.productComboAction === ProductComboActionEnum.InCreation)
        this.enableProductComboVerified();
      if (this.productComboAction === ProductComboActionEnum.InEditionAddProduct)
        this.parent.editSaveButtonDisableFlag$.next(false);
    }
  }
}

export enum ProductComboActionEnum {
  InCreation,
  InEditionView,
  InEditionAddProduct,
}

export enum ProductComboProductTypeEnum {
  SmartChoiceVoucher,
  SuperVoucher,
}

export interface ProductComboAddProductToComboEventModel {
  productList: Product[];
  codes?: string[];
}