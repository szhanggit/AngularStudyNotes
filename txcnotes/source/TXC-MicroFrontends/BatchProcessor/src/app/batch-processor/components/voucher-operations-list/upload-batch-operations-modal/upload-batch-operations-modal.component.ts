import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttachmentService, FormModel } from '@txc-angular/component-library';
import { UploadVoucherOperationsFieldsDefinition } from 'src/app/batch-processor/models/field-definition/upload-voucher-operations-fields-definition.model';
import { BatchListService } from 'src/app/batch-processor/services/data/batch-list.service';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-batch-operations-modal',
  templateUrl: './upload-batch-operations-modal.component.html',
  styleUrls: ['./upload-batch-operations-modal.component.scss'],
})
export class UploadBatchOperationsModalComponent implements OnInit {
  secondaryButton = { buttonText: 'Cancel' };
  primaryButton = { buttonText: 'Upload' };

  uploadVoucherOperationsFormGroup!: FormGroup;
  fieldsDefinition: UploadVoucherOperationsFieldsDefinition =
    new UploadVoucherOperationsFieldsDefinition();

  get attachments() {
    return this.uploadVoucherOperationsFormGroup.get(
      'attachments'
    ) as FormGroup;
  }

  get formModel(): FormModel {
    return {
      title: 'Upload batch voucher operations',
      description:
        'Please select one of the formats and actions to upload the correspond batch voucher operations.',
      formGroup: this.uploadVoucherOperationsFormGroup,
      fieldsDefinition: this.fieldsDefinition.define(),
      getSampleFile: {
        text: 'Download template',
        event: ($event) => this.onDownload($event),
      },
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private attachmentService: AttachmentService,
    private eventStateService: EventStateService,
    private batchListService: BatchListService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.uploadVoucherOperationsFormGroup = this.formBuilder.group({
      format: [1],
      attachments: [null, Validators.required],
    });
  }

  onDownload(event: Event): void {
    const href = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';
    this.attachmentService.downloadSample(event, href);
  }

  // TODO: implement API call here
  onUploadClicked() {
    this.batchListService
      .mockUpload(this.attachments.value[0])
      .subscribe((res) => {
        if (res.message === 'Success') {
          this.eventStateService.isUploadSuccess = { isSuccess: true };
          return;
        }
        this.eventStateService.isUploadSuccess = {
          isSuccess: false,
          errorMessage: res.message,
        };
      });
  }
}
