import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModel } from 'src/app/batch-processor/models/dumb-models/form.model';
import { ImportVoucherFieldsDefinition } from 'src/app/batch-processor/models/field-definition/import-voucher-fields-definition.model';
import { environment } from 'src/environments/environment';
import { DownloadTemplateModalComponent } from '../download-template-modal/download-template-modal.component';
import { AttachmentService } from '@txc-angular/component-library';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { Subject, debounceTime, skip, take, takeUntil } from 'rxjs';
import { BatchListStateService } from 'src/app/batch-processor/services/state/batch-list-state.service';
import { UtilityService } from 'src/app/batch-processor/services/utility.service';
import { UploadInventoryPayload } from 'src/app/batch-processor/models/upload-inventory-payload.model';
import { BatchListService } from 'src/app/batch-processor/services/data/batch-list.service';

@Component({
  selector: 'app-import-voucher-number-modal',
  templateUrl: './import-voucher-number-modal.component.html',
  styleUrls: ['./import-voucher-number-modal.component.scss'],
})
export class ImportVoucherNumberModalComponent implements OnInit, OnDestroy {
  secondaryButton = { buttonText: 'Cancel' };
  primaryButton = { buttonText: 'Import' };

  selectedTenant!: string;
  importVoucherNumberFormGroup!: FormGroup;
  fieldsDefinition: ImportVoucherFieldsDefinition =
    new ImportVoucherFieldsDefinition();
  destroyed$ = new Subject<void>();

  get useDefaultDate() {
    return this.importVoucherNumberFormGroup.get(
      'useDefaultDate'
    ) as FormControl;
  }

  get expiryDate() {
    return this.importVoucherNumberFormGroup.get('expiryDate') as FormControl;
  }

  get availableStartDate() {
    return this.importVoucherNumberFormGroup.get(
      'availableStartDate'
    ) as FormControl;
  }

  get availableEndDate() {
    return this.importVoucherNumberFormGroup.get(
      'availableEndDate'
    ) as FormControl;
  }

  get skuCode() {
    return this.importVoucherNumberFormGroup.get('skuCode') as FormControl;
  }

  get merchantName() {
    return this.importVoucherNumberFormGroup.get('merchantName') as FormControl;
  }

  get attachments() {
    return this.importVoucherNumberFormGroup.get('attachments') as FormControl;
  }

  get formModel(): FormModel {
    return {
      title: 'Import voucher number',
      formGroup: this.importVoucherNumberFormGroup,
      fieldsDefinition: this.fieldsDefinition.define(),
      getSampleFile: {
        text: 'Download voucher import template',
        event: ($event) => this.onDownload($event),
      },
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private attachmentService: AttachmentService,
    private eventStateService: EventStateService,
    private batchListStateService: BatchListStateService,
    private batchListService: BatchListService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }
    this.initializeForm();
    this.setFormControlValidators();
    this.listenToDateChange();
    this.listenToSkuCodeChange();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initializeForm() {
    this.importVoucherNumberFormGroup = this.formBuilder.group({
      skuCode: [null],
      merchantName: [null],
      expiryDate: [null],
      useDefaultDate: [null],
      availableStartDate: [null],
      availableEndDate: [null],
      attachments: [null, Validators.required],
    });
  }

  listenToDateChange() {
    this.useDefaultDate.valueChanges.subscribe((value) => {
      if (value) {
        this.setDefaultDates();
        this.availableStartDate.disable();
        this.availableEndDate.disable();
      } else {
        this.availableStartDate.enable();
        this.availableEndDate.enable();
      }
    });

    this.expiryDate.valueChanges.subscribe((value) => {
      if (this.useDefaultDate.value) {
        this.availableEndDate.setValue(value);
      }
    });
  }

  listenToSkuCodeChange() {
    this.skuCode.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      if (value) {
        this.batchListStateService.getMerchantBySkuCode(value);
        this.batchListStateService.merchantBySkuCode$
          .pipe(skip(1), take(2))
          .subscribe({
            next: (res) => {
              if (res?.data) {
                this.fieldsDefinition = new ImportVoucherFieldsDefinition(
                  res.data.program.name
                );
                this.merchantName.setValue(res.data.program.name);
                this.setInvalidSkuCodeError(false);
                return;
              }
              this.setInvalidSkuCodeError(true);
              this.clearMerchantName();
            },
          });
        return;
      }
      this.clearMerchantName();
    });
  }

  clearMerchantName() {
    this.merchantName.setValue(null);
    this.fieldsDefinition = new ImportVoucherFieldsDefinition('', true);
  }

  setInvalidSkuCodeError(hasError: boolean) {
    setTimeout(() => {
      if (hasError) {
        this.skuCode.setErrors({ invalidSkuCode: true });
        return;
      }

      this.skuCode.setErrors(null);
    }, 0);
  }

  setFormControlValidators() {
    this.formModel.fieldsDefinition.forEach((field) => {
      if (
        field.required &&
        field.buSpecificField &&
        field.businessUnits!.includes(this.selectedTenant)
      ) {
        const formControl = this.importVoucherNumberFormGroup.get(
          field.formControlName
        );
        formControl?.addValidators(Validators.required);
      }
    });
  }

  setDefaultDates() {
    const startDate = new Date();
    const endDate = this.expiryDate?.value ?? startDate;
    this.availableStartDate.patchValue(startDate);
    this.availableStartDate.markAsPristine();
    this.availableEndDate.patchValue(endDate);
    this.availableEndDate.markAsPristine();
  }

  onDownload(event: Event) {
    const modalRef = this.modalService.open(DownloadTemplateModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.downloadTemplate(event);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  downloadTemplate(event: Event) {
    // TODO: change to actual file on API integration
    const href = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';
    this.attachmentService.downloadSample(event, href);
  }

  onImportClicked() {
    this.expiryDate.setValue(
      this.utilityService.getLocalDateTime(this.expiryDate.value)
    );

    this.availableStartDate.setValue(
      this.utilityService.getLocalDateTime(this.availableStartDate.value)
    );

    this.availableEndDate.setValue(
      this.utilityService.getLocalDateTime(this.availableEndDate.value)
    );

    this.batchListService
      .uploadInventoryVoucherNumber(this.getUploadPayload())
      .subscribe({
        next: () => {
          this.eventStateService.isUploadSuccess = { isSuccess: true };
        },
        error: (error) => {
          this.eventStateService.isUploadSuccess = {
            isSuccess: false,
            errorMessage: error.error.Message,
          };
        },
      });
  }

  getUploadPayload() {
    const payload: UploadInventoryPayload = {
      SKUCode: this.skuCode.value,
      MerchantName: this.merchantName.value,
      ExpiryDate: this.expiryDate.value,
      StartDateAvailable: this.availableStartDate.value,
      EndDateAvailable: this.availableEndDate.value,
      // TODO: fix file input shared control
      File: this.attachments.value[0],
    };
    return payload;
  }
}
