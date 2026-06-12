import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Select2Data } from 'ng-select2-component';
import { Observable, Subject, map, switchMap, take } from 'rxjs';
import { EXPIRY_SCHEMES } from 'src/app/products/constants/expiry-schemes.constants';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { Merchant } from 'src/app/products/models/merchant.model';
import { IProgram } from 'src/app/products/models/program.model';
import { SKU } from 'src/app/products/models/sku.model';
import { ProgramService } from 'src/app/products/services/program.service';
import { ExpiryScheme } from '../../../models/expiry-scheme.model';
import { ProductType } from '../../../models/product-type.model';
import { FixedExpiryModalComponent } from './fixed-expiry-modal/fixed-expiry-modal.component';
import { FlexibleExpiryModalComponent } from './flexible-expiry-modal/flexible-expiry-modal.component';
import { ExpiryTypeEnum } from 'src/app/products/enums/expiry-type.enum';
import { ProductApiService } from 'src/app/products/services/product-api.service';
import { TimezoneService } from 'src/app/products/services/timezone.service';
import { TenantConfigService } from 'src/app/products/services/tenant-config.service';
import { DATE_REGEX } from 'src/app/products/constants/regex.const';

@Component({
  selector: 'app-product-pricing',
  templateUrl: './product-pricing.component.html',
  styleUrls: ['./product-pricing.component.scss']
})
export class ProductPricingComponent implements OnInit, OnChanges {
  @ViewChild('expirySchemeModal', { static: true }) expirySchemeModal!: TemplateRef<NgbModal>;
  @Input() wizardKey!: string;
  @Input() pricingFormGroup!: FormGroup;
  @Input() selectedTenant!: string;
  @Input() editMode: boolean = false;
  @Input() selectedType!: ProductType;
  @Input() selectedMerchant: Merchant | undefined;
  @Input() selectedSKU!: SKU;
  @Input() expirySchemeList!: number[];
  // for edit
  @Input() fixExpiryDate!: string | undefined;

  _merchantProgram!: IProgram;
  isFixedExpiryPolicy!: boolean | null | undefined;
  get merchantProgram(): IProgram {
    return this._merchantProgram;
  }
  @Input() set merchantProgram(value: IProgram) {
    this._merchantProgram = value;
    if (!this.pricingFormGroup || !this.expirySchemeList) return;
    if (this.expirySchemeList.length && this.expirySchemes.length) {
      let notFound = false;
      for (const selectedExpiryScheme of this.expirySchemeList) {
        if (!this.expirySchemes.some(schemes => selectedExpiryScheme === schemes.id)) {
          notFound = true;
        }
      }

      if (notFound) {
        this.tableExpirySchemes = [];
        this.resetExpiryList();
      }
    }
  }

  @Input() toast!: NgbdToastGlobal;
  @Input() isFixedExpiryPolicy$!: Observable<boolean | null | undefined>;
  @Output() expiryPolicyIdListChanged = new EventEmitter<number[]>();
  @Output() expiryPolicyTypeChanged = new EventEmitter<boolean>();

  isExpirySchemesLoaded$ = new Subject<{isLoaded: boolean, fixExpiryDate: string | undefined}>();
  
  tableExpirySchemes: ExpiryScheme[] = [];
  selectedExpirySchemes: ExpiryScheme[] = [];
  expirySchemes: ExpiryScheme[] = [];
  expirySchemeFilterSelect2Data: Select2Data = [];
  expirySchemeFilter: string[] = [];

  allExpirySchemes = EXPIRY_SCHEMES;
  expirationPolicyTypeEnum = ExpirationPolicyTypeEnum;
  displayedExpirySchemes: ExpiryScheme[] = [];
  fixedExpiryDate!: string | undefined;
  
  get toggleCheckboxStatus(): boolean {
    let status = true;

    this.displayedExpirySchemes.forEach((expiryScheme: ExpiryScheme) => {
      if (expiryScheme.checked === false) {
        status = false;
      }
    });

    return status;
  }

  // form
  get f(): any {
    return this.pricingFormGroup.controls;
  }

  constructor(private readonly _modalService: NgbModal,
    private readonly _programService: ProgramService,
    private readonly _productApiService: ProductApiService,
    private readonly _timezoneService: TimezoneService,
    private readonly _tenantConfigService: TenantConfigService) {}

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  ngOnInit(): void {
    this.getMerchantProgram();
    if (!this.editMode) {
      this.getProductByWizard();
    }
    this.displayedExpirySchemes = [...this.expirySchemes];
    if (this.f.sellingPricePostpaidWithTax) {
      this.f.sellingPricePostpaidWithTax.valueChanges.subscribe((value: number) => {
        if (this.f.sellingPricePostpaid) {
          if (this.selectedTenant === 'TW') {
            this.f.sellingPricePostpaid.setValue(parseFloat((value / 1.05).toString()).toFixed(4));
          } else {
            this.f.sellingPricePostpaid.setValue(value);
          }
        }
      });
    }

    if (this.f.sellingPricePrepaidWithTax) {
      this.f.sellingPricePrepaidWithTax.valueChanges.subscribe((value: number) => {
        if (this.f.sellingPricePrepaid) {
          if (this.selectedTenant === 'TW') {
            this.f.sellingPricePrepaid.setValue(parseFloat((value / 1.05).toString()).toFixed(4));
          } else {
            this.f.sellingPricePrepaid.setValue(value);
          }
        }

        if (this.f.customerFeePrepaidWithTax && this.selectedType.key === 2) {
          if (this.selectedSKU) {
            this.f.customerFeePrepaidWithTax.setValue(parseFloat((value / (this.selectedSKU.faceValueWithTax / 100)).toString()).toFixed(4));
          }
        }
      });
    }
    this.isFixedExpiryPolicy$?.subscribe(value => this.isFixedExpiryPolicy = value)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMerchant']) {
      this.getMerchantProgram();
    }
    if(this.f.isFixedExpiryPolicy && this.f.isFixedExpiryPolicy?.value !== null) {
      this.isFixedExpiryPolicy = this.f.isFixedExpiryPolicy.value;
    } 
  }

  getProductByWizard() {
    this.isExpirySchemesLoaded$
      .pipe(
        switchMap((res) =>
          this._productApiService.getProductWizard(this.wizardKey).pipe(
            map((wizard) => ({
              ...wizard,
              isExpirySchemesLoaded: res,
            }))
          )
        )
      )
      .subscribe((res) => {
        const isFixedExpiryPolicy = res.data?.productWizardStepThree?.isFixedExpiryPolicy;
        this.isFixedExpiryPolicy = isFixedExpiryPolicy;
        this.f.isFixedExpiryPolicy.setValue(isFixedExpiryPolicy);
        this.fixedExpiryDate =
          res.data.productWizardStepThree?.fixExpiryDate || null;
        this.tableExpirySchemes = this.tableExpirySchemes.map((e) => ({
          ...e,
          fixExpiryDate: res.isExpirySchemesLoaded.fixExpiryDate || this.fixedExpiryDate,
        }));
      });
  }

  OnSelectedExpirySchemesChanged($event: { expirySchemes: ExpiryScheme[], selectedExpirySchemes: ExpiryScheme[], fixExpiryDate: string | undefined }) {
    const updatedFixExpiryDate = DATE_REGEX.test($event.fixExpiryDate || '') ?   $event.fixExpiryDate : '';
    this.expirySchemes = $event.expirySchemes;
    this.displayedExpirySchemes = $event.expirySchemes;
    this.tableExpirySchemes = $event.selectedExpirySchemes;
    this.expirySchemeFilter = [...new Set($event.expirySchemes?.map(x => this.expirationPolicyTypeEnum[x.type]))];
    this.expirySchemeFilterSelect2Data = [{ value: 'All', label: 'All' }, ...this.expirySchemeFilter.map((x: string) => { return { value: x, label: x?.replace(/(?<!^)(?=[A-Z])/g, ' ') } })];
    this.isExpirySchemesLoaded$.next({isLoaded: true, fixExpiryDate: updatedFixExpiryDate});
  }

  openModal(expiryType: string) {
    let modal;
    let isFixedExpiryPolicy;
    switch (expiryType) {
      case ExpiryTypeEnum.FIXED:
        modal = FixedExpiryModalComponent;
        isFixedExpiryPolicy = true
        break;
      case ExpiryTypeEnum.FLEXIBLE:
        modal = FlexibleExpiryModalComponent;
        isFixedExpiryPolicy = false;
    }

    this.expiryPolicyTypeChanged.emit(isFixedExpiryPolicy)

    const modalRef = this._modalService.open(modal, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });

    modalRef.result.then((data) => {
      if (data?.selectedExpirySchemes) {
        this.expirySchemes = data.expirySchemes;
        this.selectedExpirySchemes = data.selectedExpirySchemes;
        this.tableExpirySchemes = data.selectedExpirySchemes;
        this.fixedExpiryDate = this.tableExpirySchemes[0]?.fixExpiryDate;
        this.fixExpiryDate = this.tableExpirySchemes[0]?.fixExpiryDate;
        this.isFixedExpiryPolicy = data.expiryType === ExpiryTypeEnum.FIXED ? true : false;
        this.f.isFixedExpiryPolicy.setValue(this.isFixedExpiryPolicy);

        const convertedDate = this.fixedExpiryDate
          ? this._timezoneService.shiftDateTimeByUtcOffsetFromDatepicker(
              this.fixedExpiryDate,
              this._tenantConfigService.fetchLocalTimeFromUTC(),
            )
          : null;

        this.f.fixExpiryDate?.setValue(
          data.expiryType === ExpiryTypeEnum.FIXED ? convertedDate : null
        );
      }
      this.resetExpiryList();
    });

    this.isExpirySchemesLoaded$.pipe(take(1)).subscribe((isLoaded) => {
      if (isLoaded) {
        modalRef.componentInstance.fixExpiryDate = this.fixExpiryDate || null;
        modalRef.componentInstance.expirySchemeFilterSelect2Data =
        this.expirySchemeFilterSelect2Data || null;
        modalRef.componentInstance.tableExpirySchemes = this.tableExpirySchemes;
        modalRef.componentInstance.displayedExpirySchemes = this.displayedExpirySchemes;
        modalRef.componentInstance.selectedExpirySchemes = this.tableExpirySchemes;
        modalRef.componentInstance.expirySchemes = this.expirySchemes;
      }
    })
  }

  removeFromSelection($event: { selectedExpirySchemes: ExpiryScheme[], index: number }) {
    this.tableExpirySchemes = [...$event.selectedExpirySchemes];
    this.tableExpirySchemes.splice($event.index, 1);
    this.resetExpiryList();
  }

  resetExpiryList() {
    if (this.tableExpirySchemes.length) {
      this.f.requiredExpiryList.setValue(this.tableExpirySchemes.length);
    } else {
      this.f.requiredExpiryList.setValue('');
    }
    this.expiryPolicyIdListChanged.emit(this.tableExpirySchemes.map(expiryScheme => expiryScheme.id));

  }

  getMerchantProgram() {
    if (this.selectedMerchant) {
      if (this.f.customerFeePrepaidWithTax && this.selectedType.key === 2) {
        if (this.selectedSKU) {
          this.f.customerFeePrepaidWithTax.setValue(parseFloat((this.f.sellingPricePrepaidWithTax.value / (this.selectedSKU.faceValueWithTax / 100)).toString()).toFixed(4));
        }
      }

      this._programService.getProgramById(this.selectedMerchant.programId).subscribe(
        res => {
          if (res.success) {
            this.merchantProgram = JSON.parse(res.data).programs.items[0];
          }
        },
        () => {
          this.toast.showDanger('Error loading program details. Please try again later.');
        });
    }
  }
}
