import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModel } from '@txc-angular/component-library';
import { UploadBatchFieldsDefinition } from 'src/app/batch-processor/models/field-definition/upload-batch-fields-definition.model';

@Component({
  selector: 'app-upload-batch',
  templateUrl: './upload-batch.component.html',
  styleUrls: ['./upload-batch.component.scss']
})
export class UploadBatchComponent implements OnInit {
  secondaryButton = { buttonText: 'Cancel' };
  primaryButton = { buttonText: 'Upload' };
  title: string = '';

  uploadBatchFormGroup!: FormGroup;
  fieldsDefinition: UploadBatchFieldsDefinition =
    new UploadBatchFieldsDefinition();
  get formModel(): FormModel {
    return {
      title: this.title,
      formGroup: this.uploadBatchFormGroup,
      fieldsDefinition: this.fieldsDefinition.define(),
    };
  }

  constructor(private formBuilder: FormBuilder,) {}

  ngOnInit(): void {
    this.uploadBatchFormGroup = this.formBuilder.group({
      uploadFile: [null, Validators.required],
    });
    
  }
}
