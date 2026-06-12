import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationBehaviorOptions, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbDateStruct, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal, ConfirmationModalComponent, TxcDateTimeService } from '@txc-angular/component-library';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { ActionMode, MasterProduct } from '../../models/master-product/master-product.model';
import { ProductType } from '../../models/product-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductBasicInfo } from '../../models/master-product/master-product-basic-info.model';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { TenantConfigService } from '../../services/tenant-config.service';
import { TimezoneService } from '../../services/timezone.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-master-product',
  templateUrl: './master-product.component.html',
  styleUrls: ['./master-product.component.scss'],
})
export class MasterProductComponent implements OnInit, OnDestroy {
  readonly ACTION_MODE_NAME_SUFFIX_CREATE = 'Product';
  readonly ACTION_MODE_NAME_SUFFIX_EDIT_DETAILS = 'Product Details';
  readonly ACTION_MODE_NAME_SUFFIX_EDIT_COMBO = 'Product Combo';
  readonly ACTION_MODE_NAME_SUFFIX_EDIT_PRICING_EXPIRY = 'Pricing & Expiry';
  readonly ACTION_MODE_NAME_SUFFIX_EDIT_TEMPLATE = 'Product Template';
  readonly ACTION_MODE_NAME_SUFFIX_EDIT_ADVANCE_SETTINGS = 'Advanced Settings';
  readonly URL_KEYWORD_PRODUCT_CREATE = 'product/create';
  readonly URL_KEYWORD_PRODUCT_EDIT = 'product/edit';
  readonly URL_KEYWORD_PRODUCT_EDIT_STEP_DETAILS = 'details';
  readonly URL_KEYWORD_PRODUCT_EDIT_STEP_COMBO = 'combo';
  readonly URL_KEYWORD_PRODUCT_EDIT_STEP_PRICING_EXPIRY = 'pricing-expiry';
  readonly URL_KEYWORD_PRODUCT_EDIT_STEP_TEMPLATE = 'template';
  readonly URL_KEYWORD_PRODUCT_EDIT_STEP_ADVANCE_SETTINGS = 'advance-settings';
  readonly URL_KEYWORD_PRODUCT_TYPE_SCV = 'smart-choice-voucher';
  readonly URL_KEYWORD_PRODUCT_TYPE_SV = 'super-voucher';
  readonly URL_PATH_PRODUCT_CREATE = '/products/product/create';
  readonly URL_PATH_PRODUCT_LIST = '/products';
  readonly URL_PATH_PRODUCT_HISTORY = '/products/product/history';
  readonly QUERY_PARAM_WIZARDKEY = 'wizardKey';
  readonly TOAST_MSG_ERROR_GET_PRODUCT_WIZARD = 'Error in getting the product wizard for master product.';
  readonly TOAST_MSG_ERROR_CREATE_PRODUCT = 'Error in creating the product.';
  readonly TOAST_MSG_ERROR_GET_PRODUCT_INFO = 'Error in getting the product data.';
  readonly TOAST_MSG_SUCCESS_UPDATE_PRODUCT = 'Product updated successfully.';
  readonly UPDATE_SUCCESS_CLEAR_STATE_TIMEOUT_MS = 5000;
  readonly TOAST_MSG_SUCCESS_SET_STOP_ISSUE_TIME = 'Set stop issue time successful!'

  selectedTenantUTC!: string;
  @ViewChild(NgbNav) ngbNav!: NgbNav;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  destroy$ = new Subject();
  stopIssueTimeModel!: NgbDateStruct;
  stopIssueTime: string = '';

  wizardKey?: string;
  productType?: ProductType;
  actionMode?: ActionMode;
  productId: number = 0;
  masterProduct: MasterProduct = new MasterProduct();

  productBasicInfo?: MasterProductBasicInfo;
  editSaveButtonDisableFlag$ = new BehaviorSubject<boolean>(false);

  active: number = 0;
  tryActive: number = 0;
  maxActive: number = 1;
  enableAll: boolean = false;
  createErrorMessage: string = '';

  isVerified_productDetails: boolean = false;
  isVerified_productCombo: boolean = false;
  isVerified_pricingAndExpiry: boolean = false;
  isVerified_productTemplate: boolean = false;
  isVerified_advanceSettings: boolean = false;

  modelStopIssueTime!: Date | null;
  userLocalTodayDate: Date = new Date();
  todayDate: Date = new Date(this.userLocalTodayDate);
  startDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate(), 23, 59)
  minDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate())

  timeOffsetHour?: number;
  timeOffsetMinute?: number;

  get isNavDisable_productCombo(): boolean {
    return !this.enableAll && this.maxActive < 2;
  }
  get isNavDisable_pricingAndExpiry(): boolean {
    return !this.enableAll && this.maxActive < 3;
  }
  get isNavDisable_productTemplate(): boolean {
    return !this.enableAll && this.maxActive < 4;
  }
  get isNavDisable_advanceSettings(): boolean {
    return !this.enableAll && this.maxActive < 5;
  }
  get isNavDisable_reviewAndConfirm(): boolean {
    return !this.enableAll && this.maxActive < 6;
  }

  get alarmFlag_productDetails(): boolean {
    return !this.isVerified_productDetails && this.enableAll;
  }
  get alarmFlag_productCombo(): boolean {
    if (this.isNavDisable_productCombo) return false;
    return !this.isVerified_productCombo && this.enableAll;
  }
  get alarmFlag_pricingAndExpiry(): boolean {
    if (this.isNavDisable_pricingAndExpiry) return false;
    return !this.isVerified_pricingAndExpiry && this.enableAll;
  }
  get alarmFlag_productTemplate(): boolean {
    if (this.isNavDisable_productTemplate) return false;
    return !this.isVerified_productTemplate && this.enableAll;
  }
  get alarmFlag_advanceSettings(): boolean {
    if (this.isNavDisable_advanceSettings) return false;
    return !this.isVerified_advanceSettings && this.enableAll;
  }
  get alarmFlag_reviewAndConfirm(): boolean {
    return false;
  }

  get nextButtonDisableFlag(): boolean {
    switch (this.active) {
      case 1:
        return !this.isVerified_productDetails;
      case 2:
        return !this.isVerified_productCombo;
      case 3:
        return !this.isVerified_pricingAndExpiry;
      case 4:
        return !this.isVerified_productTemplate;
      case 5:
        return !this.isVerified_advanceSettings;
      default:
        return true;
    }
  }

  get createButtonDisableFlag(): boolean {
    if (this.active === 6)
      return !(
        this.isVerified_productDetails &&
        this.isVerified_productCombo &&
        this.isVerified_pricingAndExpiry &&
        this.isVerified_productTemplate &&
        this.isVerified_advanceSettings
      );
    return true;
  }

  get isCreate(): boolean {
    return this.actionMode === ActionMode.Create;
  }

  get actionModeName(): string {
    let suffix: string = "";
    if (this.isCreate) {
      suffix = this.ACTION_MODE_NAME_SUFFIX_CREATE;
    }
    else if (this.active === StepEnum.Details) {
      suffix = this.ACTION_MODE_NAME_SUFFIX_EDIT_DETAILS;
    }
    else if (this.active === StepEnum.ProductCombo) {
      suffix = this.ACTION_MODE_NAME_SUFFIX_EDIT_COMBO;
    }
    else if (this.active === StepEnum.PricingExpiry) {
      suffix = this.ACTION_MODE_NAME_SUFFIX_EDIT_PRICING_EXPIRY;
    }
    else if (this.active === StepEnum.Template) {
      suffix = this.ACTION_MODE_NAME_SUFFIX_EDIT_TEMPLATE;
    }
    else if (this.active === StepEnum.AdvanceSettings) {
      suffix = this.ACTION_MODE_NAME_SUFFIX_EDIT_ADVANCE_SETTINGS;
    }
    return `${ActionMode[this.actionMode!]} ${suffix}`;
  }

  get productTypeName(): string {
    return this.productType!.value;
  }

  get isStopIssueTimeStart(): boolean {
    return this.stopIssueTime ? new Date(this.stopIssueTime) <= new Date() : false;
  }

  get isProductEditor(): boolean {
    return this.authLibService.getElementOperationFlag([environment.product_create_op_id]);
  }

  constructor(
    private readonly authLibService: AuthorizationLibraryService,
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly location: Location,
    private readonly talentConfig: TenantConfigService,
    private readonly timezoneService: TimezoneService,
    private txcDateTimeService: TxcDateTimeService,
    @Inject(LOCALE_ID) public locale: string,
  ) {
    this.selectedTenantUTC = talentConfig.fetchLocalTimeFromUTC();
    this.initTenantDateTime();
    // set action mode
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_CREATE))
      this.actionMode = ActionMode.Create;
    else if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_EDIT)) {
      this.actionMode = ActionMode.Edit;
    }
    else this.router.navigateByUrl(this.URL_PATH_PRODUCT_CREATE);
    // set product type
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_TYPE_SCV))
      this.productType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(
        (t) => t.key === 5
      );
    else if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_TYPE_SV))
      this.productType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(
        (t) => t.key === 8
      );
    else this.router.navigateByUrl(this.URL_PATH_PRODUCT_CREATE);
  }

  private initTenantDateTime() {
    this.userLocalTodayDate = new Date();
    this.todayDate = this.timezoneService.shiftDateTimeByUtcOffset(this.userLocalTodayDate, this.selectedTenantUTC);
    this.startDate = new Date(this.todayDate.getUTCFullYear(), this.todayDate.getUTCMonth(), this.todayDate.getUTCDate(), 23, 59, 59);
    this.minDate = new Date(this.startDate);
    
    const sign = this.selectedTenantUTC.charAt(0);
    const [hourStr, minuteStr] = this.selectedTenantUTC.slice(1).split(':');
    this.timeOffsetHour = parseInt(hourStr);
    this.timeOffsetMinute = parseInt(minuteStr);

    if (sign === '-') {
      this.timeOffsetHour *= -1;
      this.timeOffsetMinute *= -1;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.masterProductService.event$.pipe(takeUntil(this.destroy$)).subscribe((e) => {
      if (e[0] == 'toastDanger') {
        this.toastDanger(e[1]);
      } else if (e[0] == 'success' && e[1] == 'updateProductWizard') {
        this.ngbNav.select(this.tryActive);
      }
    });

    if (this.actionMode === ActionMode.Create) {
      this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
        this.wizardKey = params[this.QUERY_PARAM_WIZARDKEY];
        if (this.wizardKey) {
          this.masterProductApiService
            .getProductWizard(this.wizardKey)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                if (res.success) {
                  this.masterProduct = this.masterProductService.wizardDataToMasterProduct(this.wizardKey!, res.data);
                  if (!this.masterProduct.masterProductProductDetails ||
                    this.masterProduct.masterProductProductDetails.productType != this.productType?.key) {
                    this.toastDanger(this.TOAST_MSG_ERROR_GET_PRODUCT_WIZARD);
                    setTimeout(() => {
                      this.router.navigateByUrl(this.URL_PATH_PRODUCT_CREATE);
                    }, 3000);
                  }
                  if (!this.masterProduct.masterProductProductCombo)
                    this.ngbNav.select(2);
                  else if (!this.masterProduct.masterProductPricingAndExpiry)
                    this.ngbNav.select(3);
                  else if (!this.masterProduct.masterProductProductTemplate)
                    this.ngbNav.select(4);
                  else if (!this.masterProduct.masterProductAdvanceSettings)
                    this.ngbNav.select(5);
                  else
                    this.ngbNav.select(6);

                  const validation = this.masterProductService.verifyModel(this.masterProduct);
                  this.isVerified_productDetails = validation.verifiedProductDetails;
                  this.isVerified_productCombo = validation.verifiedProductCombo;
                  this.isVerified_pricingAndExpiry = validation.verifiedPricingAndExpiry;
                  this.isVerified_productTemplate = validation.verifiedProductTemplate;
                  this.isVerified_advanceSettings = validation.verifiedAdvanceSettings;
                } else {
                  this.toastDanger(this.TOAST_MSG_ERROR_GET_PRODUCT_WIZARD);
                }
              },
              error: (msg) => {
                this.toastDanger(this.TOAST_MSG_ERROR_GET_PRODUCT_WIZARD);
              },
              complete: () => { },
            });
        }
        else this.active = 1;
      });
    } else if (this.actionMode === ActionMode.Edit) {
      this.enableAll = true;

      // determines which step is the active step
      this.setActiveByUrlKeyword();

      this.activatedRoute.params.subscribe((params: any) => {
        this.productId = params.id;
        this.getStopIssueTimeByProductId(this.productId);
        this.getProductBasicInfo(this.productId);
      });
    }
  }

  private setActiveByUrlKeyword() {
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_EDIT_STEP_DETAILS)) {
      this.active = StepEnum.Details;
      return;
    }
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_EDIT_STEP_COMBO)) {
      this.active = StepEnum.ProductCombo;
      return;
    }
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_EDIT_STEP_PRICING_EXPIRY)) {
      this.active = StepEnum.PricingExpiry;
      return;
    }
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_EDIT_STEP_TEMPLATE)) {
      this.active = StepEnum.Template;
      return;
    }
    if (this.router.url.includes(this.URL_KEYWORD_PRODUCT_EDIT_STEP_ADVANCE_SETTINGS)) {
      this.active = StepEnum.AdvanceSettings;
      return;
    }
    this.active = StepEnum.Review;
  }

  verify(available: boolean) {
    switch (this.active) {
      case 1:
        this.isVerified_productDetails = available;
        break;
      case 2:
        this.isVerified_productCombo = available;
        break;
      case 3:
        this.isVerified_pricingAndExpiry = available;
        break;
      case 4:
        this.isVerified_productTemplate = available;
        break;
      case 5:
        this.isVerified_advanceSettings = available;
        break;
    }
  }

  toastSuccess(message: string) {
    this.toast.showSuccess(message);
  }

  toastDanger(message: string) {
    this.toast.showDanger(message);
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    changeEvent.preventDefault();
  }

  onActiveIdChange(changedActiveId: number) {
    if (changedActiveId === 6) this.enableAll = true;
    this.maxActive = this.maxActive > changedActiveId ? this.maxActive : changedActiveId;
  }

  protected onChangeStep(disable: boolean, active: number, cancel: boolean = false) {
    if (disable) return;
    if (this.active === active) return;
    if ((cancel && this.active > active && !this.enableAll) || this.active === 6 || !this.isProductEditor) {
      this.ngbNav.select(active);
      return;
    }
    this.masterProductService.nextStep$.next(active);
    this.tryActive = active;
  }

  changeUrl(active: number, extras?: NavigationBehaviorOptions | undefined) {
    const productType = this.productType?.value.toLowerCase().split(' ').join('-');
    switch (active) {
      case 1:
        this.router.navigateByUrl(`products/product/edit/${productType}/details/${this.productId}`, extras);
        break
      case 2:
        this.router.navigateByUrl(`products/product/edit/${productType}/combo/${this.productId}`, extras);
        break
      case 3:
        this.router.navigateByUrl(`products/product/edit/${productType}/pricing-expiry/${this.productId}`, extras);
        break
      case 4:
        this.router.navigateByUrl(`products/product/edit/${productType}/template/${this.productId}`, extras);
        break
      case 5:
        this.router.navigateByUrl(`products/product/edit/${productType}/advance-settings/${this.productId}`, extras);
        break
      default:
        this.router.navigateByUrl(`products/product/edit/${productType}/${this.productId}`, extras);
        break
    }
  }

  protected onCancelClick() {
    if (this.actionMode === ActionMode.Create) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: 'md',
        backdrop: 'static',
        centered: true,
      });
      modalRef.componentInstance.title = 'Cancel editing';
      modalRef.componentInstance.description = 'Are you sure you want to leave this page without saving?';
      modalRef.componentInstance.firstButton = {
        buttonText: 'Discard',
        buttonClass: 'btn-secondary',
      };
      modalRef.componentInstance.secondButton = {
        buttonText: 'Keep editing',
        buttonClass: 'btn-primary',
      };
      modalRef.result.then((res: string) => {
        if (res === 'cancel' && !this.isProductEditor) {
          this.router.navigateByUrl(this.URL_PATH_PRODUCT_LIST);
          return;
        }
        if (res === 'cancel' && this.wizardKey)
          this.router.navigateByUrl(this.URL_PATH_PRODUCT_LIST);
        if (res === 'cancel' && !this.wizardKey)
          this.router.navigateByUrl(this.URL_PATH_PRODUCT_CREATE);
      });
    }
    if (this.actionMode === ActionMode.Edit) {
      this.changeUrl(StepEnum.Review);
    }
  }

  protected onCreateClick() {
    if (this.wizardKey) {
      this.masterProductApiService
      .createProductByWizard(this.wizardKey, this.timeOffsetHour, this.timeOffsetMinute)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res.success)
            this.router.navigate([this.URL_PATH_PRODUCT_LIST], { state: { isCreated: true } });
          this.toastDanger(this.TOAST_MSG_ERROR_CREATE_PRODUCT);
          this.createErrorMessage = res.message;
        },
        error: (msg) => {
          this.toastDanger(this.TOAST_MSG_ERROR_CREATE_PRODUCT);
          this.createErrorMessage = msg;
        },
        complete: () => { }
      });
    }
    else {
      this.toastDanger(this.TOAST_MSG_ERROR_CREATE_PRODUCT);
    }
  }

  protected onSaveClick() {
    if (this.actionMode === ActionMode.Edit) {
      this.masterProductService.nextStep$.next(6);
    }
  }

  notifyUpdateSuccess() {
    this.changeUrl(StepEnum.Review, {
      state: {
        action: StateActionEnum.ToastSuccess,
        message: this.TOAST_MSG_SUCCESS_UPDATE_PRODUCT
      }
    });
  }

  toastMessageInState() {
    // toast update success message from the state and clear the state afterward
    if (this.actionMode === ActionMode.Edit && this.active === StepEnum.Review &&
      history.state?.action === StateActionEnum.ToastSuccess && history.state?.message
    ) {
      this.toastSuccess(history.state?.message);
      const productType = this.productType?.value.toLowerCase().split(' ').join('-');
      setTimeout(() => this.location.replaceState(`products/product/edit/${productType}/${this.productId}`, "", {})
        , this.UPDATE_SUCCESS_CLEAR_STATE_TIMEOUT_MS);
    }
  }

  openModal(content: TemplateRef<NgbModal>): void {
    if (this.stopIssueTime) {
      this.modelStopIssueTime = new Date(this.stopIssueTime);
      this.startDate = new Date(this.stopIssueTime);
    }
    const modalRef = this.modalService.open(content, { size: 'sm', backdrop: 'static', centered: true });
    modalRef.closed.subscribe(date => {
      if (!date) { return; }
      this.updateStopIssueTime();
    });
  }

  setStopIssueTime(date: string): void {
    this.masterProductApiService.updateStopIssueTime(this.productId, date).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastSuccess(this.TOAST_MSG_SUCCESS_SET_STOP_ISSUE_TIME);
          this.stopIssueTime = this.txcDateTimeService.getLocalDateTime(`${date}`);
        } else {
          this.toastDanger(res.message);
        }
      },
      error: (err) => {
        this.toastDanger(err.error.message);
      },
    });
  }

  getProductBasicInfo(productId: number) {
    this.masterProductApiService.getProductBasicInfoById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            this.productBasicInfo = data?.products?.items ? data?.products?.items[0] : null;
            return;
          }
          this.toastDanger(this.TOAST_MSG_ERROR_GET_PRODUCT_INFO);
        },
        error: _ => {
          this.toastDanger(this.TOAST_MSG_ERROR_GET_PRODUCT_INFO);
        }
      });
  }

  navigateToProductHistory(): void {
    this.router.navigateByUrl(`${this.URL_PATH_PRODUCT_HISTORY}/${this.productId}`);
  }

  navigateToSkuInventory(): void {
    // TODO: navigate to sku inventory page
  }

  getStopIssueTimeByProductId(productId: number) {
    this.masterProductApiService.getStopIssueTimeByProductId(productId).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.data);
        this.stopIssueTime = data.products?.items[0]?.stopIssueTime ? this.txcDateTimeService.getLocalDateTime(`${data.products?.items[0]?.stopIssueTime}`) : '';
      },
      error: (error: any) => {
        this.toastDanger('');
      }

    })
  }

  clearStopIssueTimeInput() {
    this.modelStopIssueTime = null;
  }

  updateStopIssueTime() {
    if (!this.modelStopIssueTime) {
      this.toast?.showDanger('Please enter valid stop issue time')
      return;
    }
    // convert the UI displayed time to match the tenant (BU) time
    const userLocalOffset = this.userLocalTodayDate.getTimezoneOffset();
    const tenantOffset = this.timezoneService.getUtcOffsetInMinutes(this.selectedTenantUTC);
    const inputIssueTime = this.timezoneService.shiftDateTimeByTimezoneOffset(this.modelStopIssueTime, tenantOffset, userLocalOffset);
    if (!inputIssueTime) {
      this.toast?.showDanger('Timezone conversion error. Please enter valid stop issue time')
      return;
    }

    const currentDate = new Date();
    if (inputIssueTime.getTime() >= currentDate.getTime()) {
      // send UTC time to API
      this.setStopIssueTime(inputIssueTime.toISOString());
    } 
    else {
      this.toast?.showDanger('Selected date should be greater or equal to current date.')
      this.modelStopIssueTime = null;
    }
  }
  
}

export enum StepEnum {
  Details = 1,
  ProductCombo = 2,
  PricingExpiry = 3,
  Template = 4,
  AdvanceSettings = 5,
  Review = 6,
}

export enum StateActionEnum {
  ToastSuccess,
}