import { Component, OnInit, Input, TemplateRef, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { BehaviorSubject, filter, forkJoin, Subject, takeUntil } from 'rxjs';
import { ContractCostSchemeEnum } from 'src/app/products/enums/contract-cost-scheme.enum';
import { ProductTypeEnum } from 'src/app/products/enums/product-type.enum';
import { SkuTypeEnum } from 'src/app/products/enums/sku-type.enum';
import { ExpirationPolicy } from 'src/app/products/models/expiry-scheme.model';
import { ChildProduct } from 'src/app/products/models/master-product/child-product.model';
import { ActionMode, MasterProduct, MasterProductPricingAndExpiry, MasterProductProductComboObject } from 'src/app/products/models/master-product/master-product.model';
import { ProductExpirationPolicyUpdateRequest, SelectedExpirationPolicy } from 'src/app/products/models/product-expiration-policy-update-request.model';
import { ProductPriceUpdateRequest } from 'src/app/products/models/product-price-update-request.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { MathService } from 'src/app/products/services/math.service';
import { TenantConfigService } from 'src/app/products/services/tenant-config.service';
import { StepEnum } from '../master-product.component';
import { ProductVoucherGeneratorEnum } from 'src/app/products/enums/voucher-generator.enum';
import { NgbDatepickerAdapterService } from 'src/app/products/services/ngb-datepicker-adapter.service';
import { TimezoneService } from 'src/app/products/services/timezone.service';
import { GreaterThanValidator, TxcDateTimeService } from '@txc-angular/component-library';
import { FixedFlexibleComponentSetup, FixedFlexibleComponentEvent } from 'src/app/products/models/expiry-scheme-fixed-flexible.model';

@Component({
  selector: 'app-master-product-pricing-and-expiry',
  templateUrl: './master-product-pricing-and-expiry.component.html',
  styleUrls: ['./master-product-pricing-and-expiry.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDatepickerAdapterService },
  ]
})
export class MasterProductPricingAndExpiryComponent implements OnInit, OnDestroy {

  @Input() parent!: any;
  @ViewChild('PopupModal') popupModal!: TemplateRef<NgbModal>;

  readonly STEP = StepEnum.PricingExpiry;
  readonly FACE_VALUE_WITH_TAX_MAX_VALUE = 20000000;
  readonly SKU_COST_WITH_TAX_MAX_VALUE = 99999999999.9999;
  readonly SKU_COST_PERCENTAGE_MAX_VALUE = 999.9999;
  readonly DECIMAL_PLACES_TWO = 2;
  readonly DECIMAL_PLACES_FOUR = 4;
  readonly NOT_APPLICABLE = "N/A";
  readonly NULL_BUT_SHOULD_NOT_BE = "?";
  readonly OK = "OK";
  readonly REFERENCE_LIST_DEFAULT_SIZE: number = 5;
  readonly EDENRED_EXPIRY_POLICY_GENERATOR_ENUMS = [
    ProductVoucherGeneratorEnum.EdenredFixed,
    ProductVoucherGeneratorEnum.EdenredFlexable
  ];
  readonly POPUP_MODAL_WINDOW_CLASS = "popup-info";
  readonly COMBO_FACE_VALUE_DIFFERENT_FROM_SCV_FACE_VALUE =
    "Products with different face value are added to this SCV Combo.";
  readonly COMBO_FACE_VALUE_EXCEEDS_SUPER_VOUCHER_FACE_VALUE =
    "One or several products presented within the combo have a face value higher than the face value of this super voucher.";
  // form control names
  readonly FACE_VALUE_WITH_TAX = "faceValueWithTax";
  readonly FACE_VALUE_WITHOUT_TAX = "faceValueWithoutTax";
  readonly DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX = "defaultSellingPricePrepaidWithTax";
  readonly DEFAULT_SELLING_PRICE_PREPAID_WITHOUT_TAX = "defaultSellingPricePrepaidWithoutTax";
  // readonly SKU_COST = "skuCost";
  readonly SKU_COST_WITH_TAX = "skuCostWithTax";
  readonly SKU_COST_WITHOUT_TAX = "skuCostWithoutTax";
  readonly DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX = "defaultSellingPricePostpaidWithTax";
  readonly DEFAULT_SELLING_PRICE_POSTPAID_WITHOUT_TAX = "defaultSellingPricePostpaidWithoutTax";
  readonly DEFAULT_SELLING_PRICE_PREPAID_PERCENTAGE = "defaultSellingPricePrepaidPercentage";
  // error messages
  readonly ERROR_GETTING_EXPIRY_SCHEME = "Error getting exipration policies";
  readonly ERROR_GETTING_TAX_RATE_OR_CHILD_PRODUCTS = "Error getting tax rate or child products";
  readonly ERROR_GETTING_TAX_RATE =
    "Error getting tax rate: the calculation for values without tax could be incorrect. Please refresh and try again.";
  readonly ERROR_GETTING_WIZARD_DATA = "Error getting data from wizard";
  readonly ERROR_GETTING_PRODUCT_DATA = "Error getting product data";
  readonly ERROR_GETTING_PRODUCT_COMBO = "Error getting product combo";
  readonly PRODUCT_SELLING_PRICE_NULL = "product selling price: null";
  readonly SKU_FACE_VALUE_AND_COST_NULL = "sku face value and cost: null";
  readonly SKU_FACE_VALUE_AND_COST_MULTIPLE_VALUES = "sku face value and cost: multiple values are found";
  readonly SKU_COST_NULL = "sku cost: null";
  readonly SKU_COST_VALUE_WARNNING = "Issue getting sku cost";
  readonly NO_MASTER_PRODUCT = "Did not get initial product data";
  readonly NO_WIZARD_KEY = "No valid wizard key provided";
  readonly EXPIRY_SCHEME_REQUIRED = "Expiry scheme is required. Please select at least one.";
  readonly ERROR_PRODUCT_TYPE_INCONSISTENT = "Product type in the database is different from the type for this page";
  readonly FAILED_TO_UPDATE_PRICING_EXPIRY = "Failed to update product price and expiry scheme. Please try again.";
  readonly ERROR_TIMEZONE_CONVERSION = "Timezone conversion error. Please enter valid date";

  masterProduct?: MasterProduct;
  tenant!: Tenant;
  selectedTenantUTC!: string;
  productType!: ProductType;
  pricingFormGroup!: FormGroup;
  isSmartChoiceVoucher = false;
  isSuperVoucher = false;
  isProductTypeError = false;
  isExpiryModified = false;

  taxRate: number | undefined;
  referenceList: ChildProduct[] = [];
  referenceListDisplay: ChildProduct[] = [];

  ProductTypeEnum = ProductTypeEnum;
  expiryComponentSetup?: FixedFlexibleComponentSetup;
  expirySchemeList: ExpirationPolicy[] = [];
  productExpiryDate?: Date;
  isFixedExpiryPolicy: boolean = false;
  selectedSchemeIdList$ = new BehaviorSubject<number[]>([]);
  selectedSchemeIdList: number[] = [];
  userLocalTodayDate: Date = new Date();
  todayDate: Date = new Date(this.userLocalTodayDate);

  timeOffsetHour?: number;
  timeOffsetMinute?: number;

  popupMessage: string = "";

  destroy$ = new Subject();

  // form
  get f(): any {
    return this.pricingFormGroup.controls;
  }

  constructor(
    private readonly tenantConfigService: TenantConfigService,
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly mathService: MathService,
    private readonly timezoneService: TimezoneService,
    private readonly txcDateTimeService: TxcDateTimeService,
    private readonly formBuilder: FormBuilder,
    private readonly ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.tenant = this.tenantConfigService.getTenant();
    this.selectedTenantUTC = this.tenantConfigService.fetchLocalTimeFromUTC();
    this.initTenantDateTime();
    this.productType = this.parent.productType as ProductType;
    this.isSmartChoiceVoucher = this.productType.key == ProductTypeEnum.SmartChoiceVoucher;
    this.isSuperVoucher = this.productType.key == ProductTypeEnum.SuperVoucher;
    this.isExpiryModified = false;
    this.subscribeProductService();

    // expiry scheme
    this.setSubscriptionsForExpiry();

    // sku and pricing
    this.setPricingFormGroup();
    this.formValueBinding();

    this.subscribeFormGroupValueChange();

    // Create
    if (this.parent.actionMode == ActionMode.Create && this.parent.wizardKey) {
      this.getMasterProductByWizard(this.parent.wizardKey);
      return;
    }
    // Edit
    if (this.parent.actionMode == ActionMode.Edit && this.parent.productId) {
      this.getProductPricingAndExpiryInfoByProductId(this.parent.productId);
      this.getProductComboByProductId(this.parent.productId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.selectedSchemeIdList$.complete();
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  toggleReferenceList() {
    // to collapse child product reference list
    if (this.referenceListDisplay.length !== this.REFERENCE_LIST_DEFAULT_SIZE) {
      this.referenceListDisplay = this.referenceList.slice(0, this.REFERENCE_LIST_DEFAULT_SIZE);
    }
    // to expand list
    else {
      this.referenceListDisplay = this.referenceList;
    }
  }

  onSelectedExpiryChange(e: FixedFlexibleComponentEvent){
    this.isExpiryModified = true;
    this.productExpiryDate = e.productExpiryDate;
    this.isFixedExpiryPolicy = e.isFixedExpiryPolicy;
    this.selectedSchemeIdList$.next(e.selectedSchemeIds);
  }

  onExpiryErrorThrown(e: Error) {
    this.parent.toastDanger(e.message);
  }

  private setExpirySchemes(list: any[]) {
    this.selectedSchemeIdList$.next(list);

    this.masterProductApiService.getExpirationPoliciesByGeneratorEnumList(this.EDENRED_EXPIRY_POLICY_GENERATOR_ENUMS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const expirationPolicies: ExpirationPolicy[] = data.expirationPolicyByGeneratorEnum;
            this.expirySchemeList = expirationPolicies;
            this.setExpiryComponentSetup();
          }
          else {
            this.parent.toastDanger(this.ERROR_GETTING_EXPIRY_SCHEME);
          }
        },
        error: (err) => {
          this.parent.toastDanger(this.ERROR_GETTING_EXPIRY_SCHEME);
        }
      });
  }

  private setExpiryComponentSetup() {
    this.expiryComponentSetup = {
      toValidateOnInit: this.parent.actionMode == ActionMode.Edit,
      isEdenredProgram: true,
      expirySchemeList: this.expirySchemeList,
      productExpiryDate: this.productExpiryDate,
      isFixedExpiryPolicy: this.isFixedExpiryPolicy,
      selectedSchemeIds: this.selectedSchemeIdList,
      todayDate: this.todayDate,
    }
  }

  private setSubscriptionsForExpiry() {
    this.selectedSchemeIdList$.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.selectedSchemeIdList = x;
        // for button control
        this.parent.verify(this.pricingFormGroup?.valid && this.selectedSchemeIdList.length !== 0);
        if (this.parent.actionMode === ActionMode.Edit) {
          this.parent.editSaveButtonDisableFlag$.next(
            (this.pricingFormGroup?.invalid ?? true)
            || this.selectedSchemeIdList.length === 0
            || !this.isExpiryModified);
        }
      });
  }

  private setPricingFormGroup() {
    const isFaceValueWithTaxDisabled = this.parent.actionMode === ActionMode.Edit && this.isSuperVoucher;

    this.pricingFormGroup = this.formBuilder.group({});
    this.pricingFormGroup.addControl(this.FACE_VALUE_WITH_TAX,
      new FormControl({ value: '', disabled: isFaceValueWithTaxDisabled }, [Validators.required, GreaterThanValidator.isGreaterThan(0), Validators.max(this.FACE_VALUE_WITH_TAX_MAX_VALUE)]));
    this.pricingFormGroup.addControl(this.FACE_VALUE_WITHOUT_TAX,
      new FormControl({ value: '', disabled: true }, [Validators.required, GreaterThanValidator.isGreaterThan(0)]));
    this.pricingFormGroup.addControl(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX,
      new FormControl({ value: '', disabled: false }, [Validators.required, Validators.min(0)]));
    this.pricingFormGroup.addControl(this.DEFAULT_SELLING_PRICE_PREPAID_WITHOUT_TAX,
      new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(0)]));

    // smart choice voucher
    if (this.isSmartChoiceVoucher) {
      this.pricingFormGroup.addControl(this.SKU_COST_WITH_TAX,
        new FormControl({ value: '', disabled: false }, [Validators.required, Validators.max(this.SKU_COST_WITH_TAX_MAX_VALUE)]));
      this.pricingFormGroup.addControl(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX, new FormControl({ value: '', disabled: false }, [Validators.required, Validators.min(0)]));
      this.pricingFormGroup.addControl(this.DEFAULT_SELLING_PRICE_POSTPAID_WITHOUT_TAX, new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(0)]));
      this.pricingFormGroup.addControl(this.SKU_COST_WITHOUT_TAX, new FormControl({ value: '', disabled: true }, [Validators.required]));
      return;
    }
    // super voucher
    if (this.isSuperVoucher) {
      this.pricingFormGroup.addControl(this.SKU_COST_WITH_TAX,
        new FormControl({ value: '', disabled: false }, [Validators.required, Validators.max(this.SKU_COST_PERCENTAGE_MAX_VALUE)]));
      this.pricingFormGroup.addControl(this.DEFAULT_SELLING_PRICE_PREPAID_PERCENTAGE, new FormControl({ value: '', disabled: true }, [Validators.required]));
      return;
    }
  }

  private setChildProductValuesAndTaxRate(childProductIds: number[]) {
    forkJoin({
      taxRate: this.masterProductApiService.getTaxRate(),
      childProducts: this.masterProductApiService.getProductVersionPricingInfoByVersionIds(childProductIds)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allRes) => {
          if (allRes.taxRate.success) {
            this.setTaxRate(allRes.taxRate.data);
          }
          if (allRes.childProducts.success) {
            const data = JSON.parse(allRes.childProducts.data);
            const productInfoList = data?.productVersionInfoMassive?.items;
            this.setChildProducts(productInfoList);
          }
          if (this.parent.actionMode == ActionMode.Edit) {
            return;
          }
          if (this.parent.actionMode == ActionMode.Create &&
            allRes.taxRate.success && allRes.childProducts.success
          ) {
            this.setDefaultValue();
            return;
          }
          this.parent.toastDanger(this.ERROR_GETTING_TAX_RATE_OR_CHILD_PRODUCTS);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_GETTING_TAX_RATE_OR_CHILD_PRODUCTS);
        },
        complete: () => {
          if (this.taxRate == null) {
            this.toastAndThrowException(this.ERROR_GETTING_TAX_RATE);
          }

          let pricing = this.masterProduct?.masterProductPricingAndExpiry;
          if (this.parent.actionMode == ActionMode.Create && pricing) {
            this.setPricingFromMasterProductPricingAndExpiry(pricing);
          }
        }
      });
  }

  private setTaxRate(responseData: string) {
    const data = JSON.parse(responseData);
    this.taxRate = data.taxRateByTenantId?.companyTaxRate;
    if (this.taxRate == null || isNaN(this.taxRate!)) {
      this.parent.toastDanger(this.ERROR_GETTING_TAX_RATE);
    }
  }

  private setChildProducts(productInfoList: any[]) {
    if (productInfoList == null || productInfoList?.length === 0) return;
    this.referenceList = productInfoList.map(x => {
      let childProduct = {
        productType: x.productType,
        productName: x.productName,
        productCode: x.productCode,
        defaultSellingPricePrepaidWithTax: x.productPrice?.sellingPricePrepaidWithTax != null
          ? this.mathService.round(x.productPrice?.sellingPricePrepaidWithTax, this.DECIMAL_PLACES_TWO)
          : null,
        defaultSellingPricePostpaidWithTax: x.productPrice?.sellingPricePostpaidWithTax != null
          ? this.mathService.round(x.productPrice?.sellingPricePostpaidWithTax, this.DECIMAL_PLACES_TWO)
          : null,
      } as ChildProduct;

      if (!x.contractSKU) {
        this.toastAndThrowException(`[${childProduct.productCode}] ${this.SKU_FACE_VALUE_AND_COST_NULL}`);
      }
      // if more than one SKU, just take the first one as per PO
      const sku = x.contractSKU;
      childProduct.faceValueWithTax = sku.faceValueWithTax;
      // sku cost could be actual value or percentage value based on the contract cost scheme
      const skuCost = this.getSkuCost(sku.contractSKUCosts);
      if (skuCost == null) {
        this.toastAndThrowException(`[${childProduct.productCode}] ${this.SKU_COST_NULL}`);
      }
      childProduct.productCostWithTax = this.getCostWithTaxValue(skuCost, childProduct.faceValueWithTax);
      childProduct.productCostPercentage = this.getCostPercentageValue(skuCost, childProduct.faceValueWithTax);
      childProduct.defaultSellingPricePrepaidPercentage = childProduct.defaultSellingPricePrepaidWithTax == null ? undefined :
        this.mathService.divideAndToPercentage(childProduct.defaultSellingPricePrepaidWithTax, childProduct.faceValueWithTax, this.DECIMAL_PLACES_FOUR);

      // SmartBooklet handling: face value, cost value, and price value should be multiplied by the mutiplier.
      // Note that no need to handle percentage values because the ratio remains the same.
      if (sku.typeId == SkuTypeEnum.SmartBooklet) {
        const multiplier = parseFloat(sku.multiplier);
        childProduct.faceValueWithTax = this.mathService.multiply(
          childProduct.faceValueWithTax ?? 0,
          multiplier,
          this.DECIMAL_PLACES_TWO
        );
        childProduct.productCostWithTax = this.mathService.multiply(
          childProduct.productCostWithTax ?? 0,
          multiplier,
          this.DECIMAL_PLACES_FOUR
        );
        childProduct.defaultSellingPricePrepaidWithTax = this.mathService.multiply(
          childProduct.defaultSellingPricePrepaidWithTax ?? 0,
          multiplier,
          this.DECIMAL_PLACES_TWO
        );
        childProduct.defaultSellingPricePostpaidWithTax = this.mathService.multiply(
          childProduct.defaultSellingPricePostpaidWithTax ?? 0,
          multiplier,
          this.DECIMAL_PLACES_TWO
        );
      }

      // DynamicFaceValue handling: selling price prepaid percentage is coming from database value "customerFeePrePaidWithTax"
      if (sku.typeId == SkuTypeEnum.DynamicFaceValue) {
        childProduct.defaultSellingPricePrepaidPercentage = x.productPrice?.customerFeePrePaidWithTax != null
          ? this.mathService.round(x.productPrice?.customerFeePrePaidWithTax, this.DECIMAL_PLACES_FOUR)
          : undefined;
      }

      return childProduct;
    });

    if (this.isSmartChoiceVoucher) {
      this.referenceList.sort(this.scvChildProductCompareFn);
    }

    this.referenceListDisplay = this.referenceList.slice(0, this.REFERENCE_LIST_DEFAULT_SIZE);
  }

  private getCostWithTaxValue(skuCost: any, faceValue: number | undefined): number | undefined {
    const cost = skuCost.costWithTax;
    // cost scheme: fixed
    if (skuCost?.skuCostContract?.costSchemeId == ContractCostSchemeEnum.Fixed) {
      return cost;
    }
    // cost scheme: percentage
    if (faceValue == null) {
      return undefined;
    }
    return Number.parseFloat(this.mathService.divide(faceValue * cost, 100));
  }

  private getCostPercentageValue(skuCost: any, faceValue: number | undefined): number | undefined {
    const cost = skuCost.costWithTax;
    // cost scheme: percentage
    if (skuCost?.skuCostContract?.costSchemeId == ContractCostSchemeEnum.CostPercentage) {
      return cost;
    }
    // cost scheme: fixed
    return this.mathService.divideAndToPercentage(cost, faceValue, this.DECIMAL_PLACES_FOUR);
  }

  // Get the sku cost based on date time peroid. All the date time comparation are based on UTC.
  private getSkuCost(skuCosts: any[]): any {
    const today: string = new Date().toISOString();

    // priority 1. take highest cost of ongoing peroid
    const ongoingSkuCosts = skuCosts
      .filter(x => Date.parse(x.validStartDate) <= Date.parse(today) && Date.parse(today) <= Date.parse(x.validEndDate))
      .sort((a: any, b: any) => b.costWithTax - a.costWithTax);
    if (ongoingSkuCosts && ongoingSkuCosts.length > 0) {
      return ongoingSkuCosts[0];
    }

    // priority 2. take cost of the closest to now (future)
    const futureSkuCosts = skuCosts
      .filter(x => Date.parse(today) < Date.parse(x.validStartDate))
      .sort((a: any, b: any) => {
        if (Date.parse(a.validStartDate) == Date.parse(b.validStartDate)) return b.costWithTax - a.costWithTax; // tie break: take the highest cost
        if (Date.parse(a.validStartDate) < Date.parse(b.validStartDate)) return -1;
        return 1;
      });
    if (futureSkuCosts && futureSkuCosts.length > 0) {
      return futureSkuCosts[0];
    }

    // priority 3. take cost of the closest to now (past)
    const pastSkuCosts = skuCosts
      .filter(x => Date.parse(x.validEndDate) < Date.parse(today))
      .sort((a: any, b: any) => {
        if (Date.parse(a.validEndDate) == Date.parse(b.validEndDate)) return b.costWithTax - a.costWithTax; // tie break: take the highest cost
        if (Date.parse(a.validEndDate) < Date.parse(b.validEndDate)) return 1;
        return -1;
      });
    if (pastSkuCosts && pastSkuCosts.length > 0) {
      return pastSkuCosts[0];
    }

    // should not get here...
    console.warn(this.SKU_COST_VALUE_WARNNING);
    return skuCosts[0];
  }

  private setDefaultValue() {
    if (this.isSmartChoiceVoucher) {
      this.setScvDefaultValue();
      return;
    }
    if (this.isSuperVoucher) {
      this.setSvDefaultValue();
      return;
    }
  }

  private setSvDefaultValue() {
    // pick the highest value of default product cost % among all child products
    const productCostPercentageList = this.referenceList
      .filter(x => x.productCostPercentage != null)
      .map(x => x.productCostPercentage!);
    const skuCostPercentage = productCostPercentageList.length === 0 ? undefined
      : Math.max(...productCostPercentageList);
    this.pricingFormGroup.get(this.SKU_COST_WITH_TAX)?.setValue(
      this.mathService.round(skuCostPercentage ?? 0, this.DECIMAL_PLACES_FOUR));

    // pick the highest value of default selling price (prepaid %) among all child products
    const defaultSellingPricePrepaidPercentageList = this.referenceList
      .filter(x => x.defaultSellingPricePrepaidPercentage != null)
      .map(x => x.defaultSellingPricePrepaidPercentage!);
    const defaultSellingPricePrepaidPercentage = defaultSellingPricePrepaidPercentageList.length === 0 ? undefined
      : Math.max(...defaultSellingPricePrepaidPercentageList);
    this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_PERCENTAGE)?.setValue(defaultSellingPricePrepaidPercentage);
  }

  private setScvDefaultValue() {
    const winner = this.referenceList[0];
    if (winner == null) return;

    this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.setValue(
      this.mathService.round(winner.faceValueWithTax ?? 0, this.DECIMAL_PLACES_TWO));
    this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX)?.setValue(
      this.mathService.round(winner.defaultSellingPricePrepaidWithTax ?? 0, this.DECIMAL_PLACES_TWO));
    this.pricingFormGroup.get(this.SKU_COST_WITH_TAX)?.setValue(
      this.mathService.round(winner.productCostWithTax ?? 0, this.DECIMAL_PLACES_FOUR));
    this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX)?.setValue(
      this.mathService.round(winner.defaultSellingPricePostpaidWithTax ?? 0, this.DECIMAL_PLACES_TWO));
  }

  // smart choice voucher child product compare function for sorting
  private scvChildProductCompareFn(a: ChildProduct, b: ChildProduct): number {
    // priority 1: prepaid default selling price (with tax)
    let aValue = a.defaultSellingPricePrepaidWithTax ?? -Infinity;
    let bValue = b.defaultSellingPricePrepaidWithTax ?? -Infinity;
    if (aValue !== bValue) {
      return bValue - aValue;
    }

    // priority 2: postpaid default selling price (with tax)
    aValue = a.defaultSellingPricePostpaidWithTax ?? -Infinity;
    bValue = b.defaultSellingPricePostpaidWithTax ?? -Infinity;
    if (aValue !== bValue) {
      return bValue - aValue;
    }

    // priority 3: product cost (with tax)
    aValue = a.productCostWithTax ?? -Infinity;
    bValue = b.productCostWithTax ?? -Infinity;
    if (aValue !== bValue) {
      return bValue - aValue;
    }

    return 0;
  }

  private setPricingFromMasterProductPricingAndExpiry(data: MasterProductPricingAndExpiry) {
    this.setFormControlValueIfDataNotNull(
      this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX), data.faceValue);
    this.setFormControlValueIfDataNotNull(
      this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX), data.sellingPricePrepaidWithTax);
    this.setFormControlValueIfDataNotNull(
      this.pricingFormGroup.get(this.SKU_COST_WITH_TAX), data.cost);

    if (this.isSmartChoiceVoucher) {
      this.setFormControlValueIfDataNotNull(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX), data.sellingPricePostpaidWithTax);
      return;
    }
    if (this.isSuperVoucher) {
      this.setFormControlValueIfDataNotNull(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_PERCENTAGE),
        this.mathService.divideAndToPercentage(data.sellingPricePrepaidWithTax ?? 0, data.faceValue, this.DECIMAL_PLACES_FOUR));
      return;
    }
  }

  private setFormControlValueIfDataNotNull(control: AbstractControl | null, data: any) {
    if (data != null) {
      control?.setValue(data);
    }
  }

  private getMasterProductByWizard(wizardKey: string) {
    this.masterProductApiService.getProductWizard(wizardKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.masterProduct = this.masterProductService.wizardDataToMasterProduct(wizardKey, res.data);

            let combo = this.masterProduct!.masterProductProductCombo;
            if (combo) {
              const childProductIds = combo.productComboList
                ?.filter(x => x.status && x.status !== 0)
                ?.map(x => x.childProductVersionId ?? 0) ?? [];
              this.setChildProductValuesAndTaxRate(childProductIds.filter(x => x != 0));
            }

            const fixExpiryDate = this.masterProduct!.masterProductPricingAndExpiry?.fixExpiryDate;
            this.setProductExpiryDate(fixExpiryDate);
            this.isFixedExpiryPolicy = this.masterProduct!.masterProductPricingAndExpiry?.isFixedExpiryPolicy ?? false;
            if (this.expirySchemeList.length === 0) {
              let expiryIdList = this.masterProduct!.masterProductPricingAndExpiry?.expiryPolicyIdList ?? [];
              this.setExpirySchemes(expiryIdList);
            }
            return;
          }
          this.parent.toastDanger(this.ERROR_GETTING_WIZARD_DATA);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_GETTING_WIZARD_DATA);
        }
      });
  }

  private getProductPricingAndExpiryInfoByProductId(productId: number) {
    this.masterProductApiService.getProductPricingExpiryInfoByProductId(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.setPricingAndExpiryDataFromResponse(res.data);
            return;
          }
          this.toastAndThrowException(this.ERROR_GETTING_PRODUCT_DATA);
        },
        error: _ => {
          this.toastAndThrowException(this.ERROR_GETTING_PRODUCT_DATA);
        }
      });
  }

  private setPricingAndExpiryDataFromResponse(responseData: any) {
    const data = JSON.parse(responseData);
    const productInfo = data?.products?.items.length > 0 ? data?.products?.items[0] : null;
    if (productInfo && productInfo.productType == this.productType.key) {
      // expiry schemes
      this.isFixedExpiryPolicy = productInfo.isFixedExpiryPolicy;
      this.setProductExpiryDate(productInfo.expiryDate);
      this.setExpirySchemes(productInfo.productExpirySchemes.map((x: any) => x.expirationPolicyId));

      // pricing
      const sku = productInfo.contractSKU != null && productInfo.contractSKU.length > 0 ? productInfo.contractSKU[0] : null;
      if (sku == null) {
        this.toastAndThrowException(this.SKU_FACE_VALUE_AND_COST_NULL);
      }
      const skuCost = this.getlatestSkuCost(sku.contractSKUCosts);
      if (skuCost == null) {
        this.toastAndThrowException(this.SKU_COST_NULL);
      }
      const productPrice = productInfo.productPrice;
      if (productPrice == null) {
        this.toastAndThrowException(this.PRODUCT_SELLING_PRICE_NULL);
      }
      this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.setValue(sku.faceValueWithTax);
      this.pricingFormGroup.get(this.FACE_VALUE_WITHOUT_TAX)?.setValue(sku.faceValueWithoutTax);
      this.pricingFormGroup.get(this.SKU_COST_WITH_TAX)?.setValue(skuCost.costWithTax);
      this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX)?.setValue(productPrice.sellingPricePrepaidWithTax);
      this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITHOUT_TAX)?.setValue(productPrice.sellingPricePrepaid);
      if (this.isSmartChoiceVoucher) {
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX)?.setValue(productPrice.sellingPricePostpaidWithTax);
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITHOUT_TAX)?.setValue(productPrice.sellingPricePostpaid);
        this.pricingFormGroup.get(this.SKU_COST_WITHOUT_TAX)?.setValue(skuCost.costWithoutTax);
      }
      return;
    }
    if (productInfo && productInfo.productType != this.productType.key) {
      this.isProductTypeError = true;
      this.toastAndThrowException(this.ERROR_PRODUCT_TYPE_INCONSISTENT);
    }
  }

  private getlatestSkuCost(skuCostList: any[]): any {
    if (skuCostList == null || skuCostList?.length === 0) return null;

    const orderedCosts = skuCostList.sort((a: any, b: any) => {
      if (Date.parse(a.validStartDate) == Date.parse(b.validStartDate)) return 0;
      if (Date.parse(a.validStartDate) < Date.parse(b.validStartDate)) return 1;
      return -1;
    });
    return orderedCosts[0];
  }

  private getProductComboByProductId(productId: number) {
    this.masterProductApiService.getMasterProductCombo(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const productComboList = res.data as MasterProductProductComboObject[];
            const childProductIds = productComboList
              ?.filter(x => x.status && x.status !== 0)
              ?.map(x => x.childProductVersionId ?? 0) ?? [];
            this.setChildProductValuesAndTaxRate(childProductIds.filter(x => x != 0));
            return;
          }
          this.toastAndThrowException(this.ERROR_GETTING_PRODUCT_COMBO);
        },
        error: _ => {
          this.toastAndThrowException(this.ERROR_GETTING_PRODUCT_COMBO);
        }
      });
  }

  private subscribeFormGroupValueChange() {
    this.pricingFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        // for button control
        this.parent.verify(this.pricingFormGroup.valid && this.selectedSchemeIdList.length !== 0);
        if (this.parent.actionMode === ActionMode.Edit) {
          this.parent.editSaveButtonDisableFlag$.next(
            this.pricingFormGroup.invalid
            || this.pricingFormGroup.pristine
            || this.selectedSchemeIdList.length === 0);
        }
      });
  }

  private subscribeProductService() {
    // stepper notification
    this.masterProductService.nextStep$
      .pipe(
        filter(step => step != this.STEP),
        takeUntil(this.destroy$)
      ).subscribe(x => {
        this.onStepChange();
      });
  }

  private formValueBinding() {
    this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.pricingFormGroup.get(this.FACE_VALUE_WITHOUT_TAX)?.setValue(this.mathService.divide(val, this.taxRate ?? 1));

        // super voucher
        if (this.isSuperVoucher) {
          let defaultSellingPricePrepaidPercentage = Number.parseFloat(
            this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_PERCENTAGE)?.value);
          this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX)
            ?.setValue(isNaN(defaultSellingPricePrepaidPercentage)
              ? 0
              : this.mathService.divide(val * defaultSellingPricePrepaidPercentage, 100, this.DECIMAL_PLACES_TWO)
            );
        }
      });

    this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX)?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITHOUT_TAX)
          ?.setValue(this.mathService.divide(val, this.taxRate ?? 1));

        // super voucher
        if (this.isSuperVoucher) {
          let faceValueWithTax = Number.parseFloat(
            this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.value);
          this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_PERCENTAGE)
            ?.setValue(this.mathService.divideAndToPercentage(val, faceValueWithTax, this.DECIMAL_PLACES_FOUR) ?? NaN);
        }
      });

    // smart choice voucher
    if (this.isSmartChoiceVoucher) {
      this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX)?.valueChanges
        .pipe(takeUntil(this.destroy$)).subscribe((val) => {
          this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITHOUT_TAX)
            ?.setValue(this.mathService.divide(val, this.taxRate ?? 1));
        });
      this.pricingFormGroup.get(this.SKU_COST_WITH_TAX)?.valueChanges
        .pipe(takeUntil(this.destroy$)).subscribe((val) => {
          this.pricingFormGroup.get(this.SKU_COST_WITHOUT_TAX)
            ?.setValue(this.mathService.divide(val, this.taxRate ?? 1));
        });
    }
  }

  private validateStep(): boolean {
    this.markAllAsDirty();

    if (this.parent.actionMode == ActionMode.Edit && this.isProductTypeError) {
      this.parent.toastDanger(this.ERROR_PRODUCT_TYPE_INCONSISTENT);
      return false;
    }

    if (this.parent.actionMode == ActionMode.Create && this.masterProduct == null) {
      this.parent.toastDanger(this.NO_MASTER_PRODUCT);
      return false;
    }
    if (this.parent.actionMode == ActionMode.Create &&
      (this.masterProduct!.wizardKey == null || this.masterProduct!.wizardKey.length == 0)
    ) {
      this.parent.toastDanger(this.NO_WIZARD_KEY);
      return false;
    }

    if (this.taxRate == null || isNaN(this.taxRate!)) {
      this.parent.toastDanger(this.ERROR_GETTING_TAX_RATE);
      return false;
    }

    if (this.selectedSchemeIdList.length === 0) {
      this.parent.toastDanger(this.EXPIRY_SCHEME_REQUIRED);
      return false;
    }
    if (this.pricingFormGroup.invalid) return false;

    return true;
  }

  private onStepChange() {
    const isStepValidAndAllowToLeave = this.validateStep();
    if (!isStepValidAndAllowToLeave) return;
    // Create
    if (this.parent.actionMode == ActionMode.Create) {
      this.checkWarningAndUpdateWizard();
      return;
    }
    // Edit
    this.checkWarningAndUpdatePricingAndExpiry();
  }

  private checkWarningAndUpdateWizard() {
    const data = {
      // SKU
      faceValue: Number.parseFloat(this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.value),
      cost: Number.parseFloat(this.pricingFormGroup.get(this.SKU_COST_WITH_TAX)?.value),
      // Default pricing
      sellingPricePrepaid: Number.parseFloat(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITHOUT_TAX)?.value),
      sellingPricePrepaidWithTax: Number.parseFloat(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX)?.value),
      sellingPricePostpaid: Number.parseFloat(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITHOUT_TAX)?.value),
      sellingPricePostpaidWithTax: Number.parseFloat(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX)?.value),
      // Expiry scheme
      expiryPolicyIdList: this.selectedSchemeIdList,
      fixExpiryDate: this.productExpiryDate != null ? this.getUTCDateString(this.productExpiryDate) : null,
      isFixedExpiryPolicy: (this.isFixedExpiryPolicy as boolean | undefined),
    } as MasterProductPricingAndExpiry;

    this.masterProduct!.tenant = this.tenantConfigService.getTenant();
    this.masterProduct!.masterProductPricingAndExpiry! = data;

    const isPopupShown = this.showWarningPopupIfRequired();
    if (!isPopupShown) {
      this.masterProductService.pushMasterProduct(this.masterProduct!, this.STEP);
    }
  }

  private showWarningPopupIfRequired(): boolean {
    if (this.isSmartChoiceVoucher &&
      !this.referenceList
        .filter(x => x.faceValueWithTax != null)
        .every(x => x.faceValueWithTax == this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.value)
    ) {
      this.openPopupModal(this.COMBO_FACE_VALUE_DIFFERENT_FROM_SCV_FACE_VALUE);
      return true;
    }

    if (this.isSuperVoucher &&
      !this.referenceList
        .filter(x => x.faceValueWithTax != null)
        .every(x => x.faceValueWithTax! <= this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.value)
    ) {
      this.openPopupModal(this.COMBO_FACE_VALUE_EXCEEDS_SUPER_VOUCHER_FACE_VALUE);
      return true;
    }

    return false;
  }

  // warning popup
  private openPopupModal(msg: string) {
    this.popupMessage = msg;
    const modalRef = this.ngbModal.open(this.popupModal, { windowClass: this.POPUP_MODAL_WINDOW_CLASS, centered: true });
    modalRef.result.then((data) => {
      if (this.parent.actionMode == ActionMode.Create && data === this.OK) {
        this.masterProductService.pushMasterProduct(this.masterProduct!, this.STEP);
        return;
      }
      if (this.parent.actionMode == ActionMode.Edit && data === this.OK) {
        this.updateProductPricingAndExpiry();
        return;
      }
    });
  }

  private checkWarningAndUpdatePricingAndExpiry() {
    const isPopupShown = this.showWarningPopupIfRequired();
    if (!isPopupShown) {
      this.updateProductPricingAndExpiry();
    }
  }

  private updateProductPricingAndExpiry() {
    const pricingRequestBody = {
      productId: Number.parseInt(
        this.parent.productId),
      sellingPricePrepaidWithTax: Number.parseFloat(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_PREPAID_WITH_TAX)?.value),
      sellingPricePostpaidWithTax: Number.parseFloat(
        this.pricingFormGroup.get(this.DEFAULT_SELLING_PRICE_POSTPAID_WITH_TAX)?.value),
      // SKU
      faceValue: Number.parseFloat(
        this.pricingFormGroup.get(this.FACE_VALUE_WITH_TAX)?.value),
      cost: Number.parseFloat(
        this.pricingFormGroup.get(this.SKU_COST_WITH_TAX)?.value),
      timeOffsetHour: this.timeOffsetHour,
      timeOffsetMinute: this.timeOffsetMinute,
    } as ProductPriceUpdateRequest;

    const expiryRequestBody = {
      productId: Number.parseInt(this.parent.productId),
      selectedExpirationPolicyList: this.selectedSchemeIdList.map(x => {
        return {
          expirationPolicyId: x
        } as SelectedExpirationPolicy
      }),
      fixedExpiryDate: this.productExpiryDate != null ? this.getUTCDateString(this.productExpiryDate) : null,
      isFixedExpiryPolicy: this.isFixedExpiryPolicy,
    } as ProductExpirationPolicyUpdateRequest;

    forkJoin({
      pricing: this.masterProductApiService.updateProductPrice(pricingRequestBody),
      expiry: this.masterProductApiService.updateProductExpirationPolicy(expiryRequestBody),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allRes) => {
          if (allRes.pricing.success && allRes.expiry.success) {
            this.parent.notifyUpdateSuccess();
            return;
          }
          this.parent.toastDanger(this.FAILED_TO_UPDATE_PRICING_EXPIRY);
        },
        error: _ => {
          this.parent.toastDanger(this.FAILED_TO_UPDATE_PRICING_EXPIRY);
        }
      });
  }

  private markAllAsDirty() {
    this.pricingFormGroup.markAsDirty();
    Object.keys(this.pricingFormGroup.controls).forEach(key => {
      this.pricingFormGroup.controls[key].markAsDirty();
    });
  }

  private toastAndThrowException(msg: string) {
    this.parent.toastDanger(msg)
    throw new Error(msg);
  }

  // convert the UI displayed time to match the tenant (BU) time
  private getUTCDateString(buLocalDate: Date | undefined): string {
    if (buLocalDate) {
      const userLocalOffset = this.userLocalTodayDate.getTimezoneOffset();
      const tenantOffset = this.timezoneService.getUtcOffsetInMinutes(this.selectedTenantUTC);
      const convertedDate = this.timezoneService.shiftDateTimeByTimezoneOffset(buLocalDate, tenantOffset, userLocalOffset);
      if (!convertedDate) {
        this.toastAndThrowException(this.ERROR_TIMEZONE_CONVERSION);
      }
      return convertedDate.toISOString();
    }
    return '';
  }

  private setProductExpiryDate(utcDateString: string | undefined) {
    if (utcDateString) {
      const buLocalDateString = this.txcDateTimeService.getLocalDateTime(utcDateString);
      this.productExpiryDate = new Date(buLocalDateString);
    }
  }

  private initTenantDateTime() {
    this.userLocalTodayDate = new Date();
    this.todayDate = this.timezoneService.shiftDateTimeByUtcOffset(this.userLocalTodayDate, this.selectedTenantUTC);

    const sign = this.selectedTenantUTC.charAt(0);
    const [hourStr, minuteStr] = this.selectedTenantUTC.slice(1).split(':');
    this.timeOffsetHour = parseInt(hourStr);
    this.timeOffsetMinute = parseInt(minuteStr);

    if (sign === '-') {
      this.timeOffsetHour *= -1;
      this.timeOffsetMinute *= -1;
    }
  }
}
