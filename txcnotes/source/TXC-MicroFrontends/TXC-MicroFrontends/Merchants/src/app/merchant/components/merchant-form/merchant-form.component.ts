import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, forkJoin, takeUntil, ReplaySubject } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { MERCHANT_CONSTANTS } from '../../constants/merchants.constant';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { MerchantAddressBody, MerchantBody } from '../../models/merchant-body.model';
import { Merchant } from '../../models/merchant.model';
import { IProgram } from '../../models/program.model';
import { MerchantService } from '../../services/merchant.service';
import { ProgramService } from '../../services/program.service';
import { SecurityKeyService } from '../../services/security-key.service';
import { DictionaryService } from '../../services/dictionary.service';
import { Select2Data } from 'ng-select2-component';
import { Dictionary } from '../../models/dictionary.model';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss']
})
export class MerchantFormComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  @Input() merchantFormGroup: FormGroup = new FormGroup({});
  @Input() merchant!: Merchant | undefined;
  @Input() tenant!: string;
  @Input() isEdit = false;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSettlementDateMandatory = false;
  programs: IProgram[] = [];

  categories = [{
    key: 0,
    value: 'Category'
  }];

  productIssuersSelect2Data: Select2Data = MERCHANT_CONSTANTS.ISSUER_TYPE.map((dropdown: { key: number, value: string }) => { return { value: dropdown.key, label: dropdown.value } });
  taxTypesSelect2Data: Select2Data = MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE.map((dropdown: { key: number, value: string }) => { return { value: dropdown.key, label: dropdown.value } });
  settlementFrequenciesSelect2Data: Select2Data = MERCHANT_CONSTANTS.AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE.map((dropdown: { key: number, value: string }) => { return { value: dropdown.key, label: dropdown.value } });
  reimbursementTypesSelect2Data: Select2Data = MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE.map((dropdown: { key: number, value: string }) => { return { value: dropdown.key, label: dropdown.value } });
  merchantAutoTypesSelect2Data: Select2Data = MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE.map((dropdown: { key: number, value: string }) => { return { value: dropdown.key, label: dropdown.value } });
  merchantAcquirersSelect2Data: Select2Data = PRODUCT_CONSTANTS.MERCHANT_ACQUIRER.map((dropdown: { key: number, value: string }) => { return { value: dropdown.key, label: dropdown.value } });
  numbersSelect2Data: Select2Data = [];

  statusSelect2Data = [
    {
      value: 0,
      label: 'Inactive'
    },
    {
      value: 1,
      label: 'Active'
    }
  ];

  categoriesSelect2Data: Select2Data = [];
  programsSelect2Data: Select2Data = [];
  countriesSelect2Data: Select2Data = [];

  cities: Dictionary[] = [];
  citiesSelect2Data: Select2Data = [];

  statesOrProvinces: Dictionary[] = [];
  statesOrProvincesSelect2Data: Select2Data = [];

  loading$ = new BehaviorSubject<boolean>(true);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService,
    private readonly _merchantService: MerchantService,
    private readonly _programService: ProgramService,
    private readonly _dictionaryService: DictionaryService) {
  }

  ngOnInit(): void {
    this.numbersSelect2Data = [{
      value: null, label: 'Select'} as any, 
      ...Array(31).fill(0).map((x, i) => { 
      if (i === 0) {
        return { value: 0, label: 'End of Month' }
      } else {
        return { value: i, label: i.toString() } 
      }
    })];

    if (!this.isEdit) {
      this.generateSecurityKey();
    }

    // get programs using get programs endpoint
    this._programService.getAllProgram().subscribe(res => {
      this.programs = JSON.parse(res.data).allProgramsByTenantId;
    });

    forkJoin(
      this._programService.getAllProgram(),
      this._dictionaryService.getDictionaryItemsByCategory('MerchantCategory'),
      this._dictionaryService.getDictionaryItemsByCategory('Country'),
      this._dictionaryService.getDictionaryItemsByCategory('City'),
      this._dictionaryService.getDictionaryItemsByCategory('StateOrProvince'),
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').
        pipe(
          takeUntil(this.destroyed$))
    ).subscribe(([programs, categories, countries, cities, statesOrProvinces, merchantAcquirers]) => {
      this.programsSelect2Data = JSON.parse(programs.data).allProgramsByTenantId.map((program: IProgram) => { return { value: program.id, label: program.displayName } });
      this.categoriesSelect2Data = JSON.parse(categories.data).dictionaries.map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      this.countriesSelect2Data = JSON.parse(countries.data).dictionaries.map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      this.merchantAcquirersSelect2Data = JSON.parse(merchantAcquirers.data).dictionaries.map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });

      this.cities = JSON.parse(cities.data).dictionaries;
      this.statesOrProvinces = JSON.parse(statesOrProvinces.data).dictionaries;

      if (this.isEdit) {
        const countryValue = this.merchantFormGroup.get('address.countryId')?.value;
        const stateOrProvinceValue = this.merchantFormGroup.get('address.stateOrProvinceId')?.value;
        this.statesOrProvincesSelect2Data = this.statesOrProvinces.filter(dictionary => dictionary.parentId === countryValue).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
        this.citiesSelect2Data = this.cities.filter(dictionary => dictionary.parentId === stateOrProvinceValue).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      }
    },
      () => {
        this.toast.showDanger('Error loading dropdown values. Please try again later.');
      }, () => {
        this.loading$.next(false);
      });


    if (this.tenant === 'TW') {
      const settlementDateValue = this.merchantFormGroup.get('autoCreateReimbursementIntervalType')?.value;
      if (settlementDateValue === 1) {
        this._setSettlementDay(settlementDateValue);
      }
      
      this.merchantFormGroup.get('autoCreateReimbursementIntervalType')!
        .valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe((value: number) => {
          this._setSettlementDay(value, true);
        });

      this.toggleSettlementDateControl(this.merchantAutoTypeControl?.value);
      this.listenForMerchantAutoType();
    }

    this.merchantFormGroup.get('address.countryId')!
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((countryValue: number) => {
        this.merchantFormGroup.get('address.stateOrProvinceId')?.setValue(0);
        this.merchantFormGroup.get('address.stateOrProvinceId')?.enable();
        this.statesOrProvincesSelect2Data = this.statesOrProvinces.filter(dictionary => dictionary.parentId === countryValue).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      });

    this.merchantFormGroup.get('address.stateOrProvinceId')!
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((stateOrProvinceValue: number) => {
        this.merchantFormGroup.get('address.cityId')?.setValue(0);
        this.merchantFormGroup.get('address.cityId')?.enable();
        this.citiesSelect2Data = this.cities.filter(dictionary => dictionary.parentId === stateOrProvinceValue).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  listenForMerchantAutoType() {
    this.merchantFormGroup.get('merchantAutoType')!
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((merchantAutoTypeValue: number) => {
        this.toggleSettlementDateControl(merchantAutoTypeValue);
      });
  }

  toggleSettlementDateControl(value: number) {
    this.isSettlementDateMandatory = false;
    this.settlementDateControl?.clearValidators();
    
    // 1 is AutoCreate
    if (value === 1) {
      this.isSettlementDateMandatory = true;
      this.settlementDateControl?.setValidators([Validators.required]);
      this.settlementDateControl?.markAsDirty();
    }

    this.settlementDateControl?.updateValueAndValidity();
  }

  // form
  get f(): any {
    return this.merchantFormGroup.controls;
  }

  get settlementDateControl(): AbstractControl | null {
    return this.merchantFormGroup?.get('autoCreateReimbursementDay');
  }

  get merchantAutoTypeControl(): AbstractControl | null {
    return this.merchantFormGroup?.get('merchantAutoType');
  }

  private createMerchantEmail(): FormGroup {
    return new FormGroup({
      'emailAddress': new FormControl('', [Validators.email]),
    });
  }

  public addMerchantEmail() {
    const emails = this.merchantFormGroup.get('merchantContactEmailList') as FormArray
    emails.push(this.createMerchantEmail())
  }

  public removeMerchantEmail(i: number) {
    const emails = this.merchantFormGroup.get('merchantContactEmailList') as FormArray
    if (emails.length > 1) {
      emails.removeAt(i)
    } else {
      emails.reset()
    }
  }

  private createInternalEmail(): FormGroup {
    return new FormGroup({
      'internalEmailAddress': new FormControl('', Validators.email),
    });
  }

  public addInternalEmail() {
    const emails = this.merchantFormGroup.get('edenredContactEmailList') as FormArray
    emails.push(this.createInternalEmail())
  }

  public removeInternalEmail(i: number) {
    const emails = this.merchantFormGroup.get('edenredContactEmailList') as FormArray
    if (emails.length > 1) {
      emails.removeAt(i)
    } else {
      emails.reset()
    }
  }

  private _setSettlementDay(value: number, resetValue = false) {
    if (value === 1) {
      this.merchantFormGroup.get('autoCreateReimbursementDay')?.disable();
    } else {
      this.merchantFormGroup.get('autoCreateReimbursementDay')?.enable();
    }

    if (!resetValue) return;

    this.merchantFormGroup.get('autoCreateReimbursementDay')?.setValue(-1);
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  generateSecurityKey() {
    this.f.securityKey.setValue(this._securityKeyService.generateSecurityKey(31));

    if (!this.merchantFormGroup.dirty) {
      this.merchantFormGroup.markAsDirty();
    }
  }

  OnSubmit(): void {
    if (this.merchantFormGroup.valid) {
      this.isLoading$.next(true);

      // const addressBody = new AddressBody();
      // addressBody.detailAddressLine = this.f.merchantAddress.value;
      let merchantBody = new MerchantBody(this.merchantFormGroup.getRawValue());
      const body: MerchantAddressBody = { merchant: merchantBody, address: this.f.address.getRawValue() };
      body.merchant.name = this.f.merchantName.value;

      for (const [index, merchantContactEmail] of body.merchant.merchantContactEmailList.entries()) {
        body.merchant.merchantContactEmailList[index] = merchantContactEmail.emailAddress;
      }
      for (const [index, edenredContactEmail] of body.merchant.edenredContactEmailList.entries()) {
        body.merchant.edenredContactEmailList[index] = edenredContactEmail.internalEmailAddress;
      }

      if (this.tenant === 'TW') {
        if (body.merchant.autoCreateReimbursementDay === -1) {
          body.merchant.autoCreateReimbursementDay = null;
        }
      }

      if (this.isEdit) {
        body.merchant.id = this.f.merchantId.value;
        body.merchant.modifier = 'modifier';

        this._merchantService.updateMerchant(body).subscribe(
          res => {
            this.navigateToMerchantDetails(res.success);
            this.isLoading$.next(false);
          },
          err => {
            let errorMessage = err.error.Message ?? err.error.message;
            if (err.error.data.length) {
              err.error.data.forEach((errorMsg: string) =>
                errorMessage = `${errorMessage}. ${errorMsg}`
              );
            }
            this.toast.showDanger(errorMessage);
            this.isLoading$.next(false);
          });

      } else {
        this._merchantService.createMerchant(body).subscribe(
          () => {
            this.backToList('created');
            this.isLoading$.next(false);
          },
          err => {
            let errorMessage = err.error.Message ?? err.error.message;
            if (err.error.data.length) {
              err.error.data.forEach((errorMsg: string) =>
                errorMessage = `${errorMessage}. ${errorMsg}`
              );
            }
            this.toast.showDanger(errorMessage);
            this.isLoading$.next(false);
          });
      }
    }
  }

  cancelAction() {
    if (this.isEdit) {
      this.navigateToMerchantDetails(false);
    } else {
      this.backToList();
    }
  }

  backToList(action?: string): void {
    if (action && action === 'created') {
      this._router.navigate(['/merchants'],
        {
          state: {
            action: action,
            merchantName: this.f.merchantName.value
          }
        });
    } else {
      this._router.navigate(['/merchants']);
    }
  }

  navigateToMerchantDetails(edited: boolean) {
    if (this.merchant) {
      if (edited) {
        this._router.navigate(['merchants/details'],
          {
            queryParams: {
              tenantName: this.tenant,
              merchantId: this.merchant.merchantId
            },
            state: {
              action: 'merchantUpdated',
              merchantName: this.f.merchantName.value
            }
          });
      } else {
        this._router.navigate(['merchants/details'],
          {
            queryParams: {
              tenantName: this.tenant,
              merchantId: this.merchant.merchantId
            },
            state: {
              action: 'merchantUpdateCancelled',
            }
          });
      }
    }
  }

}
