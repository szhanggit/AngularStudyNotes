import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttachmentService, FormModel } from '@txc-angular/component-library';
import { UploadBatchOrderFieldsDefinition } from 'src/app/batch-processor/models/field-definition/upload-batch-order-fields-definition.model';
import { BatchListService } from 'src/app/batch-processor/services/data/batch-list.service';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-batch-order-modal',
  templateUrl: './create-batch-order-modal.component.html',
  styleUrls: ['./create-batch-order-modal.component.scss'],
})
export class CreateBatchOrderModalComponent implements OnInit {
  secondaryButton = { buttonText: 'Cancel' };
  primaryButton = { buttonText: 'Upload' };

  uploadBatchOrderFormGroup!: FormGroup;
  fieldsDefinition: UploadBatchOrderFieldsDefinition =
    new UploadBatchOrderFieldsDefinition();

  get attachments() {
    return this.uploadBatchOrderFormGroup.get('attachments') as FormGroup;
  }

  get formModel(): FormModel {
    return {
      title: 'Upload batch order',
      formGroup: this.uploadBatchOrderFormGroup,
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
    this.uploadBatchOrderFormGroup = this.formBuilder.group({
      attachments: [null, Validators.required],
    });
  }

  onDownload(event: Event) {
    const href = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';
    this.attachmentService.downloadSample(event, href);
  }

  // TODO: implement API call here
  onUploadClicked() {
    this.batchListService
      .mockUpload(this.attachments?.value[0])
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
