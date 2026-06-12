import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { DATE_REGEX } from 'src/app/products/constants/regex.const';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ExpiryTypeEnum } from 'src/app/products/enums/expiry-type.enum';
import { ExpiryScheme } from 'src/app/products/models/expiry-scheme.model';

@Component({
  selector: 'app-fixed-expiry-modal',
  templateUrl: './fixed-expiry-modal.component.html',
  styleUrls: ['./fixed-expiry-modal.component.scss'],
})
export class FixedExpiryModalComponent implements OnInit {
  displayedExpirySchemes: ExpiryScheme[] = [];
  tableExpirySchemes: ExpiryScheme[] = [];
  selectedExpirySchemes: ExpiryScheme[] = [];
  fixExpiryDate!: string | undefined;
  fixEndOfDay = 'FixEndOfDay';
  noExpireDate = 'NoExpireDate';
  expirationPolicyTypeEnum = ExpirationPolicyTypeEnum;
  expirySchemeForm!: FormGroup;
  isDatePickerDisabled: boolean = true;
  datePickerValue!: string;

  get currentDate(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  get fixedExpiryCondition() {
    return this.expirySchemeForm.get('fixedExpiryCondition');
  }

  get fixedDate() {
    return this.expirySchemeForm.get('fixedDate');
  }

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initializeExpirySchemeForm();
    this.initializeDatePickerValues();
    this.listenToFixedExpiryCondition();
  }

  closeModal(isConfirm: boolean) {
    if (isConfirm) {
      this.activeModal.close({
        expirySchemes: this.displayedExpirySchemes,
        selectedExpirySchemes: this.displayedExpirySchemes
          .filter((e) => e.id === this.fixedExpiryCondition?.value?.id)
          .map((e) => ({
            ...e,
            fixExpiryDate: this.fixedDate?.value,
            isFromModal: true,
            isFixedExpiryPolicy: true
          })),
        expiryType: ExpiryTypeEnum.FIXED,
      });
    } else {
      this.activeModal.close();
    }
  }

  onDateSelect(event: NgbDate) {
    this.fixedDate?.setValue(this.formatDateFromNgbDate(event));
    this.datePickerValue = this.fixedDate?.value;
  }

  onDatePickerInputChange(event: any) {
    const datePickerInputValue = event.srcElement?.value;
    this.datePickerValue = datePickerInputValue;

    if (!this.validateDateInput(datePickerInputValue)) {
      this.fixedDate?.setErrors({ invalidDate: true });
    } else {
      this.fixedDate?.setErrors(null);
      this.fixedDate?.setValue(this.datePickerValue);
    }
  }

  validateDateInput(value: string) {
    // validate date format
    const dateRegex = DATE_REGEX;
    // validate past dates
    const currentDate = new Date(new Date().toLocaleDateString());
    const valueDate = new Date(new Date(value).toLocaleDateString());

    return dateRegex.test(value) && valueDate >= currentDate;
  }

  formatDateFromNgbDate(date: NgbDate) {
    return `${date.year}/${date.month}/${date.day}`;
  }

  initializeExpirySchemeForm() {
    const selectedExpiryScheme = this.selectedExpirySchemes[0];
    const expiryDate = new Date(
      selectedExpiryScheme?.fixExpiryDate || this.fixExpiryDate!
    ).toUTCString();
    const isFromModal = this.tableExpirySchemes[0]?.isFromModal;

    this.datePickerValue =
      selectedExpiryScheme?.fixExpiryDate || this.fixExpiryDate
        ? this.getNgbDateStructFromDate(expiryDate, isFromModal!)
        : '';
    this.expirySchemeForm = this.fb.group({
      fixedExpiryCondition: [
        this.displayedExpirySchemes.find((e) =>
          this.isSelectedExpirySchemeEqual(e, selectedExpiryScheme)
        ) || null,
        Validators.required,
      ],
      fixedDate: [this.datePickerValue || this.fixExpiryDate],
    });
  }

  initializeDatePickerValues() {
    this.isDatePickerDisabled = !this.fixedDate?.value && !this.fixExpiryDate;
    if (!this.fixedExpiryCondition?.value) {
      this.datePickerValue = '';
    }
  }

  isSelectedExpirySchemeEqual(
    expiryScheme: ExpiryScheme,
    selectedExpiryScheme: ExpiryScheme
  ) {
    return expiryScheme?.displayName === selectedExpiryScheme?.displayName;
  }

  getNgbDateStructFromDate(date: string, isFromModal: boolean = false) {
    const extractedDate = date.match(/\d{1,2}\s\w+\s\d{4}/)
    const modifiedDate = new Date(extractedDate ? extractedDate[0] : '');
    if (isFromModal) {
      modifiedDate.setDate(modifiedDate.getDate() + 1)
    }
    const ngbDate = {
      year: modifiedDate.getFullYear(),
      month: modifiedDate.getMonth() + 1,
      day: modifiedDate.getDate(),
    } as NgbDate;

    return this.formatDateFromNgbDate(ngbDate);
  }

  listenToFixedExpiryCondition() {
    this.fixedExpiryCondition?.valueChanges.subscribe((val) => {
      if (val?.displayName.includes(this.fixEndOfDay)) {
        this.fixedDate?.setValidators(Validators.required);
        this.isDatePickerDisabled = false;
      } else {
        this.fixedDate?.setValue(null);
        this.datePickerValue = '';
        this.fixExpiryDate = '';
        this.fixedDate?.clearValidators();
        this.isDatePickerDisabled = true;
      }

      this.fixedDate?.updateValueAndValidity();
    });
  }
}
