import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { DfvDetailsFieldsDefinition } from 'src/app/shared/models/fields-definition/dfv-fields-definition.model';
import { ProductReferenceModel } from 'src/app/shared/models/product-reference.model';

@Component({
  selector: 'app-dfv-form',
  templateUrl: './dfv-form.component.html',
  styleUrls: ['./dfv-form.component.scss']
})
export class DfvFormComponent implements OnInit {
  @Input() dfvDetailsFormGroup!: FormGroup;
  @Input() selectedProduct!: ProductReferenceModel | undefined;

  dfvDetailsFieldsDefinition!: DfvDetailsFieldsDefinition;
  dfvDetailsFormArray!: FormArray;

  isAddBtnDisabled: boolean = false;

  get dfvDetailsFormModel(): FormModel {
    return {
      title: '',
      formGroup: this.dfvDetailsFormGroup,
      fieldsDefinition: this.dfvDetailsFieldsDefinition.define(),
    };
  }
  constructor(
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.dfvDetailsFormArray = this.dfvDetailsFormGroup.get('dfvDetailsFormArray') as FormArray;
    this.dfvDetailsFieldsDefinition = new DfvDetailsFieldsDefinition();

    // get placeholder value from product logic
    const faceValue = this.dfvDetailsFormModel.fieldsDefinition.find(
      (field: InputModel) => field.formControlName === 'faceValue'
    ) as InputModel;
    faceValue.placeholder = this.selectedProduct?.faceValueRange;
  }

  createFormGroup(){
    const [minValue, maxValue] = this.selectedProduct!.faceValueRange!.split(' to ').map(Number);
    this.dfvDetailsFormArray.push(
      this.formBuilder.group({
        faceValue: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(minValue), 
          Validators.max(maxValue)
        ]),
        voucherQuantity: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.pattern(/^[1-9]\d*$/)
        ])
      })
    );
  }

  addFields() {
    if (this.dfvDetailsFormArray.controls.length < 10) {
      this.createFormGroup();
      if (this.dfvDetailsFormArray.controls.length > 9) {
        this.isAddBtnDisabled = true;
      }
    }
  }
  
  removeFields(index: number) {
    this.dfvDetailsFormArray.removeAt(index);
    this.isAddBtnDisabled = false;
  }
}
