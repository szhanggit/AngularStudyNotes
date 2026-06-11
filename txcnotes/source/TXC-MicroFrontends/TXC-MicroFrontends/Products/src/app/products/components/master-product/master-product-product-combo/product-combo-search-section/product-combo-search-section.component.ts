import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/products/models/product.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductComboService } from 'src/app/products/services/master-product-combo.service';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { ProductComboActionEnum, ProductComboProductTypeEnum } from '../master-product-product-combo.component';

@Component({
  selector: 'app-product-combo-search-section',
  templateUrl: './product-combo-search-section.component.html',
  styleUrls: ['./product-combo-search-section.component.scss']
})
export class ProductComboSearchSectionComponent implements OnInit {
  @Input() parent!: any;
  @Input() productComboAction!: ProductComboActionEnum;
  @Input() productType!: ProductComboProductTypeEnum;

  readonly STEP_NUMBER: number = 1;
  readonly TITLE: string = 'Search products for this combo';
  readonly SUB_TITLE: string = 'Find product by entering child product code or searching product name.';

  searchProductList: Array<Product> = [];
  selectProductList: Array<Product> = [];

  sectionCollapsed: boolean = false;
  stepFocused: boolean = false;
  productCodeList: string = '';
  searchKeyword: string = '';

  get isSmartChoiceVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher;
  }

  get isSuperVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SuperVoucher;
  }

  get productCodeListValue(): string {
    return this.productCodeList;
  }

  set productCodeListValue(value) {
    this.productCodeList = value;
  }

  constructor(
    private elementRef: ElementRef,
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly masterProductComboService: MasterProductComboService,
    ) {
  }

  ngOnInit(): void {
    this.parent.sectionStep$.subscribe((value: any) => { this.stepFocused = value === this.STEP_NUMBER});
  }

  collapse(collapsed?: boolean): void {
    if (collapsed != undefined) {
      this.sectionCollapsed = collapsed;
    }
    else {
      this.sectionCollapsed = !this.sectionCollapsed;
    }
  }

  autoGrowTextAreaZone(isClearing?: boolean) {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    const maxHeight = 100;

    if (isClearing) {
      this.productCodeListValue = '';
      textarea.value = '';
    }

    textarea.style.height = '0px';
    textarea.style.height = textarea.scrollHeight + 5 < maxHeight ? textarea.scrollHeight + 5 + 'px' : maxHeight + 'px';
  }

  onEnterClick(): void {
    this.parent.sectionStep$.next(1);
    const codes = this.productCodeList.split(/\r?\n/);
    this.masterProductApiService
      .getProductInfoByProductCodeList(codes)
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const productInfoList: Product[] = this.masterProductService.convertProductInfoDataToProductList(data);
            if (productInfoList) {
              this.masterProductComboService.addProductsByCodeToConfirmProductList(productInfoList, codes, this.productType);
            }
            this.parent.sectionStep$.next(2);
          }
        },
        error: (msg) => {
          this.parent.noRequiredData('product list');
        },
        complete: () => {
          this.autoGrowTextAreaZone(true);
        },
      });
  }

  onSearchClick(): void {
    if (!this.searchKeyword) return;
    this.parent.sectionStep$.next(1);
    this.masterProductApiService.productInfoByKeyword(this.searchKeyword).subscribe({
      next: (res) => {
        if (res.success) {
          this.onSearchResetClick();
          const data = JSON.parse(res.data);
          const productInfoList: Product[] = this.masterProductService.convertProductInfoDataToProductList(data);
          for (let product of productInfoList) {
            product.checked = true;
            this.searchProductList.push(product);
            this.selectProductList.push(product);
          }
        }
      },
      error: (msg) => {
        this.parent.noRequiredData('product list');
      },
      complete: () => {
      },
    });
  }

  onSearchResetClick() {
    this.toggleCheckboxes(false);
    this.searchProductList = [];
    this.selectProductList = [];

    this.autoGrowTextAreaZone(true);
    this.searchKeyword = '';
  }

  onAddToComboClick(): void {
    this.masterProductComboService.addSelectProductsToConfirmProductList(this.selectProductList, this.productType);
    this.parent.sectionStep$.next(2);
    this.onSearchResetClick();
  }

  toggleCheckboxes(checked: boolean): void {
    if (checked) {
      this.searchProductList.forEach((product) => {
        product.checked = true;
        if (
          this.selectProductList.find(
            (p) => p.productCode === product.productCode
          ) === undefined
        )
          this.selectProductList.push(product);
      });
    } else {
      this.searchProductList.forEach((product) => {
        product.checked = false;
        if (
          this.selectProductList.find(
            (p) => p.productCode === product.productCode
          )
        )
          this.selectProductList.splice(
            this.selectProductList.findIndex(
              (p) => p.productCode === product.productCode
            ),
            1
          );
      });
    }
  }

  onSelectionCheckClick(checked: boolean, productCode: string): void {
    if (checked) {
      if (this.selectProductList.find((p) => p.productCode === productCode) === undefined &&
        this.searchProductList.find((p) => p.productCode === productCode))
        this.selectProductList.push(this.searchProductList.find((p) => p.productCode === productCode)!);
    } else {
      if (this.selectProductList.find((p) => p.productCode === productCode)) 
        this.selectProductList.splice(this.selectProductList.findIndex((p) => p.productCode === productCode), 1);
    }
  }
}
