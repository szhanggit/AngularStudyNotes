import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ProductVoucherGeneratorEnum } from 'src/app/products/enums/voucher-generator.enum';
import { ExpirationPolicy } from 'src/app/products/models/expiry-scheme.model';
import { NgbDatepickerAdapterService } from 'src/app/products/services/ngb-datepicker-adapter.service';
import { FixedExpiryModalSetup, FixedExpiryModalResponse } from 'src/app/products/models/expiry-scheme-fixed-flexible.model';

@Component({
  selector: 'app-expiry-scheme-fixed',
  templateUrl: './expiry-scheme-fixed.component.html',
  styleUrls: ['./expiry-scheme-fixed.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDatepickerAdapterService },
  ]
})
export class ExpirySchemeFixedComponent implements OnInit, OnDestroy {
  @Input() modalSetup!: FixedExpiryModalSetup;

  @ViewChild('expiryDatepicker') expiryDatepicker!: NgbInputDatepicker;

  // form control names
  readonly FIX_EXPIRY_SELECTION = "fixExpirySelection";
  readonly FIXED_EXPIRY_DATE = "fixedExpiryDate";

  ExpirationPolicyTypeEnum = ExpirationPolicyTypeEnum;
  ProductVoucherGeneratorEnum = ProductVoucherGeneratorEnum;

  expiryFormGroup!: FormGroup;

  // full list of fixed schemes (EdenredFixed or ThirdPartyFixed)
  get expirySchemeList() : ExpirationPolicy[] {
    return this.modalSetup.expirySchemeList;
  }
  get fixEndOfDayId() : number {
    return this.modalSetup.fixEndOfDayId;
  }
  get minDate() : NgbDateStruct {
    return this.modalSetup.minDate;
  }
  // form
  get f(): any {
    return this.expiryFormGroup.controls;
  }

  constructor(
    private readonly ngbActiveModel: NgbActiveModal,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.setExpiryFormGroup();
  }

  ngOnDestroy(): void {
  }

  onConfirm() {
    this.checkSelectedItem();
    this.ngbActiveModel.close({
      expirySchemeList: this.expirySchemeList,
      fixedExpiryDate: this.expiryFormGroup.get(this.FIXED_EXPIRY_DATE)?.value,
      isFixedExpiryPolicy: this.expirySchemeList.some(x => x.checked === true),
    } as FixedExpiryModalResponse);
  }

  private checkSelectedItem() {
    const selectedId = this.expiryFormGroup.get(this.FIX_EXPIRY_SELECTION)?.value;
    this.expirySchemeList.forEach(x => {
      x.checked = x.id === selectedId;
    });
  }

  onCancel() {
    this.ngbActiveModel.dismiss();
  }

  onClickItem(expiryPolicyId: number) {
    const isFixEndOfDayClicked = expiryPolicyId === this.fixEndOfDayId;
    this.setFixedExpiryDateControl(isFixEndOfDayClicked);
  }

  private setFixedExpiryDateControl(isFixEndOfDayClicked: boolean) {
    const control = this.expiryFormGroup.get(this.FIXED_EXPIRY_DATE);
    if (isFixEndOfDayClicked) {
      control?.enable();
      return;
    }
    if (this.expiryDatepicker.isOpen()) {
      this.expiryDatepicker.close();
    }
    control?.reset();
    control?.disable();
  }

  private setExpiryFormGroup() {
    const setupData = this.getFormGroupSetup();
    // form group
    this.expiryFormGroup = this.formBuilder.group({});
    this.expiryFormGroup.addControl(this.FIX_EXPIRY_SELECTION,
      new FormControl({ value: setupData.selectedPolicyId, disabled: false }, [Validators.required]));
    this.expiryFormGroup.addControl(this.FIXED_EXPIRY_DATE,
      new FormControl({ value: setupData.fixedExpiryDate, disabled: setupData.fixedExpiryDate == null }));
    this.expiryFormGroup.addValidators(this.FixedExpiryDateValidator(setupData.fixEndOfDayId ?? 0));
  }

  private getFormGroupSetup(): ExpiryFormGroupSetup {
    const selectedId = this.modalSetup.expirySchemeList.filter(x => x.checked)?.pop()?.id;
    return {
      fixEndOfDayId: this.fixEndOfDayId,
      selectedPolicyId: selectedId,
      fixedExpiryDate: this.modalSetup.fixedExpiryDate,
    };
  }

  // fixed expiry date is required if FixEndOfDay is selected
  private FixedExpiryDateValidator(fixEndOfDayId: number): ValidatorFn {
    const selection = this.FIX_EXPIRY_SELECTION;
    const fixedExpiryDate = this.FIXED_EXPIRY_DATE;
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedId = control.get(selection)?.value;
      const expiryDate = control.get(fixedExpiryDate)?.value;
      const isFixEndOfDaySelected = selectedId === fixEndOfDayId;
      if (!isFixEndOfDaySelected ||
        (isFixEndOfDaySelected && expiryDate && expiryDate.year && expiryDate.month && expiryDate.day)
      ) {
        return null;
      }
      return { invalidFixEndOfDay: true };
    }
  }
}

export interface ExpiryFormGroupSetup {
  fixEndOfDayId: number,
  selectedPolicyId?: number,
  fixedExpiryDate?: NgbDateStruct,
}
