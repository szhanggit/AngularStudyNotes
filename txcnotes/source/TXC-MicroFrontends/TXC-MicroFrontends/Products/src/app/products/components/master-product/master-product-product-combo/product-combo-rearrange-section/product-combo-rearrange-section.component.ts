import { Component, Input, OnInit } from '@angular/core';
import { SortableOptions } from 'sortablejs';
import { ProductComboBrand } from 'src/app/products/models/master-product/child-product.model';
import { Product } from 'src/app/products/models/product.model';
import { MasterProductComboService } from 'src/app/products/services/master-product-combo.service';
import { MasterProductProductComboComponent, ProductComboActionEnum, ProductComboProductTypeEnum } from '../master-product-product-combo.component';

@Component({
  selector: 'app-product-combo-rearrange-section',
  templateUrl: './product-combo-rearrange-section.component.html',
  styleUrls: ['./product-combo-rearrange-section.component.scss']
})
export class ProductComboRearrangeSectionComponent implements OnInit {
  @Input() parent!: MasterProductProductComboComponent;
  @Input() productComboAction!: ProductComboActionEnum;
  @Input() productType!: ProductComboProductTypeEnum;

  readonly STEP_NUMBER: number = 3;
  readonly TITLE: string = 'Rearrange product sequence';

  existProductList: Product[] = [];
  confirmProductList: Product[] = [];
  rearrangeProductList: Product[] = [];
  rearrangeBrandList: ProductComboBrand[] = [];

  sectionCollapsed: boolean = false;
  stepFocused: boolean = false;
  sortableOptions: SortableOptions = {
    onChange: (event)=>{ this.parent.enableEditSaveButtonFlag();}
  };

  get isShowNumberInTitleIcon(): boolean {
    return this.productComboAction === ProductComboActionEnum.InCreation || this.productComboAction === ProductComboActionEnum.InEditionAddProduct;
  }

  get isSmartChoiceVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SmartChoiceVoucher;
  }

  get isSuperVoucher(): boolean {
    return this.productType === ProductComboProductTypeEnum.SuperVoucher;
  }

  constructor(
    private readonly masterProductComboService: MasterProductComboService
  ) {
  }

  ngOnInit(): void {
    this.parent.sectionStep$.subscribe((value: any) => {
      this.stepFocused = value === this.STEP_NUMBER;
      this.collapse(!this.stepFocused) 
    });
    this.masterProductComboService.existProductList$.subscribe((value: any) => { this.existProductList = value; });
    this.masterProductComboService.confirmProductList$.subscribe((value: any) => { this.confirmProductList = value; });
    this.masterProductComboService.rearrangeProductList$.subscribe((value: any) => { this.rearrangeProductList = value; });
    this.masterProductComboService.rearrangeBrandList$.subscribe((value: any) => { this.rearrangeBrandList = value; });
  }

  collapse(collapsed?: boolean): void {
    if (collapsed != undefined) {
      this.sectionCollapsed = collapsed;
    }
    else {
      this.sectionCollapsed = !this.sectionCollapsed;
    }
  }
}
