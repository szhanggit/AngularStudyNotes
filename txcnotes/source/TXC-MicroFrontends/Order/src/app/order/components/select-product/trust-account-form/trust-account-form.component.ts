import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/order/services/form.service';
import { ProductService } from 'src/app/order/services/product.service';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { TrustAccountFieldsDefinition } from 'src/app/shared/models/fields-definition/trust-account-fields-definition.model';

@Component({
  selector: 'app-trust-account-form',
  templateUrl: './trust-account-form.component.html',
  styleUrls: ['./trust-account-form.component.scss'],
})
export class TrustAccountFormComponent implements OnInit {
  @Input() trustAccountFormGroup!: FormGroup;
  @Input() editMode = false;
  @Input() isMVP = false;
  trustAccountFieldsDefinition!: TrustAccountFieldsDefinition;

  trustExpirySchemeData = [
    {
      label: 'Select',
      value: -1,
    },
  ];

  trustAccountListData = [
    {
      label: 'Select',
      value: -1,
    },
  ];

  get trustAccountFormModel(): FormModel {
    return {
      title: '',
      formGroup: this.trustAccountFormGroup,
      fieldsDefinition: this.trustAccountFieldsDefinition.define(),
    };
  }

  constructor(
    private productSvc: ProductService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.trustAccountFieldsDefinition = new TrustAccountFieldsDefinition(
      this.editMode
    );
    const isTrustAccountNeededField = this.formService.getControlByName(
      this.trustAccountFormGroup,
      'isTrustAccountNeeded'
    );
    const trustExpirySchemeField = this.formService.getControlByName(
      this.trustAccountFormGroup,
      'trustExpiryScheme'
    );
    const trustExpiryDateField = this.formService.getControlByName(
      this.trustAccountFormGroup,
      'trustExpiryDate'
    );
    const trustAccountOptionField = this.formService.getControlByName(
      this.trustAccountFormGroup,
      'trustAccountOption'
    );
    const trustAmountField = this.formService.getControlByName(
      this.trustAccountFormGroup,
      'trustAmount'
    );
    const trustAccountField = this.formService.getControlByName(
      this.trustAccountFormGroup,
      'trustAccount'
    );

    const trustAccount = this.formService.getFieldByName(
      this.trustAccountFormModel,
      'trustAccount'
    );
    const trustExpiryScheme = this.formService.getFieldByName(
      this.trustAccountFormModel,
      'trustExpiryScheme'
    );
    const trustExpiryDate = this.formService.getFieldByName(
      this.trustAccountFormModel,
      'trustExpiryDate'
    );
    const trustAmount = this.formService.getFieldByName(
      this.trustAccountFormModel,
      'trustAmount'
    );

    this.toggleHideDependentFields(isTrustAccountNeededField.value);

    isTrustAccountNeededField.valueChanges.subscribe((value: boolean) => {
      this.toggleHideDependentFields(value);
      if (!value) {
        this.removeErrorsFromHiddenFields();
      }
    });
    if (this.isMVP) {
      if (trustExpirySchemeField.value) {
        this.formService.handleSchemeChange(
          trustExpirySchemeField,
          trustExpirySchemeField.value,
          trustExpiryDate,
          trustExpiryDateField
        );
      }
      trustExpirySchemeField.valueChanges.subscribe((value) => {
        this.formService.handleSchemeChange(
          trustExpirySchemeField,
          value,
          trustExpiryDate,
          trustExpiryDateField
        );
      });
    }

    // get expiry scheme data array and map it for expiryScheme dropdown
    this.trustExpirySchemeData = this.trustExpirySchemeData.concat(
      JSON.parse(this.productSvc.getExpirySchemeData().data)
    );
    this.trustExpirySchemeData.push({
      label: trustExpirySchemeField.value,
      value: trustExpirySchemeField.value,
    });
    trustExpiryScheme!.select2Data = this.trustExpirySchemeData;

    this.trustAccountListData = this.trustAccountListData.concat(
      JSON.parse(this.productSvc.getTrustAccountList().data)
    );
    // if trustaccount data is coming from product list
    this.trustAccountListData.push({
      label: trustAccountField.value,
      value: trustAccountField.value,
    });
    trustAccount!.select2Data = this.trustAccountListData;

    trustAccountOptionField.valueChanges.subscribe((value) => {
      if (value === 'Default') {
        this.formService.disableField(trustAmountField, trustAmount);
      } else if (value === 'Custom') {
        this.formService.enableField(trustAmountField, trustAmount);
      }
    });
  }

  private toggleHideDependentFields(toggleValue: boolean) {
    this.trustAccountFormModel.fieldsDefinition.forEach((field) => {
      if (field.formControlName !== 'isTrustAccountNeeded') {
        field.hidden = !toggleValue;
      }
    });
  }

  private removeErrorsFromHiddenFields() {
    Object.keys(this.trustAccountFormGroup.controls).forEach((controlName) => {
      const control = this.formService.getControlByName(
        this.trustAccountFormGroup,
        controlName
      );
      control.setErrors(null);
    });
  }
}
