import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { FormService } from 'src/app/order/services/form.service';
import { ProductService } from 'src/app/order/services/product.service';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { ProductDetailsFieldsDefinition } from 'src/app/shared/models/fields-definition/product-details-fields-definition.model';

@Component({
  selector: 'app-product-details-form',
  templateUrl: './product-details-form.component.html',
  styleUrls: ['./product-details-form.component.scss'],
})
export class ProductDetailsFormComponent implements OnInit {
  @Input() productDetailsFormGroup!: FormGroup;
  productDetailsFieldsDefinition!: ProductDetailsFieldsDefinition;

  expirySchemeData = [];

  get productDetailsFormModel(): FormModel {
    return {
      title: '',
      formGroup: this.productDetailsFormGroup,
      fieldsDefinition: this.productDetailsFieldsDefinition.define(),
    };
  }

  constructor(
    private productSvc: ProductService,
    private formService: FormService,
    private quotationStateService: QuotationStateService
  ) {}

  ngOnInit(): void {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => {
        this.productDetailsFieldsDefinition =
          new ProductDetailsFieldsDefinition(orderMode);
      }
    );

    const expirySchemeField = this.productDetailsFormGroup.get(
      'expiryScheme'
    ) as FormControl;
    const expiryDateField = this.productDetailsFormGroup.get(
      'expiryDate'
    ) as FormControl;
    const voucherQuantityField = this.productDetailsFormGroup.get(
      'voucherQuantity'
    ) as FormControl;

    const expirySchemeFieldModel =
      this.productDetailsFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'expiryScheme'
      ) as InputModel;
    const expiryDateFieldModel =
      this.productDetailsFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'expiryDate'
      ) as InputModel;
    const voucherQuantityFieldModel =
      this.productDetailsFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'voucherQuantity'
      ) as InputModel;

    // get expiry scheme data array and map it for expiryScheme dropdown
    this.expirySchemeData = this.expirySchemeData.concat(
      JSON.parse(this.productSvc.getExpirySchemeData().data)
    );
    expirySchemeFieldModel!.select2Data = this.expirySchemeData;
    // expiry date logic
    expirySchemeField!.valueChanges.subscribe((value) => {
      this.formService.handleSchemeChange(
        expirySchemeField,
        value,
        expiryDateFieldModel,
        expiryDateField
      );
    });

    if (voucherQuantityField!.status === 'DISABLED') {
      voucherQuantityFieldModel!.required = false;
    }
  }
}
