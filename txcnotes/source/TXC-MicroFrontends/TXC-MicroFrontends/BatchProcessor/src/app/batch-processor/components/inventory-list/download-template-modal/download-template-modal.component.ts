import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModel } from 'src/app/batch-processor/models/dumb-models/form.model';
import { DownloadTemplateFieldsDefinition } from 'src/app/batch-processor/models/field-definition/download-template-fields-definition.model';
import { Merchant } from 'src/app/batch-processor/models/merchant.model';

@Component({
  selector: 'app-download-template-modal',
  templateUrl: './download-template-modal.component.html',
  styleUrls: ['./download-template-modal.component.scss']
})
export class DownloadTemplateModalComponent implements OnInit {
  secondaryButton = {buttonText: 'Cancel'};
  primaryButton = {buttonText: 'Download'};

  merchant!: FormGroup;

  // mock merchant list data until API integration
  merchantsList: Merchant[] = [
    {
      merchantId: 2554,
      merchantName: 'AUTOTEST20231020070009417',
      keyword: 'AUTOTEST20231020070009417',
    },
    {
      merchantId: 2550,
      merchantName: 'settlement date defaults to zero',
      keyword: 'settlement date defaults to zero',
    },
    {
      merchantId: 2549,
      merchantName: 'rsMerchant_007',
      keyword: 'rsMerchant_007',
    },
    {
      merchantId: 2548,
      merchantName: 'rsMerchant_006',
      keyword: 'rsMerchant_006',
    },
    {
      merchantId: 2542,
      merchantName: 'Merchant20231018202415',
      keyword: 'Merchant20231018202415',
    }
  ];

  downloadTemplateFormGroup!: FormGroup;
  fieldsDefinition: DownloadTemplateFieldsDefinition =
    new DownloadTemplateFieldsDefinition(this.merchantsList);
  get formModel(): FormModel {
    return {
      title: 'Download voucher import template',
      formGroup: this.downloadTemplateFormGroup,
      fieldsDefinition: this.fieldsDefinition.define(),
    };
  }

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.downloadTemplateFormGroup = this.formBuilder.group({
      merchant: [null, Validators.required],
    });

    this.merchant = this.downloadTemplateFormGroup.get('merchant') as FormGroup;
  }

}
