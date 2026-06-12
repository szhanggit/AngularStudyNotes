import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormModel } from '../../models/dumb-models/form.model';
import { OrderMemoFieldsDefinition } from '../../models/fields-definition/order-memo-fields-definition.model';

@Component({
  selector: 'app-order-memo',
  templateUrl: './order-memo.component.html',
  styleUrls: ['./order-memo.component.scss']
})
export class OrderMemoComponent implements OnInit {
  @Input() memoFormGroup!: FormGroup;
  orderMemoFieldsDefinition!: OrderMemoFieldsDefinition;
  get memoFormModel(): FormModel {
    return {
      title: 'Memo',
      formGroup: this.memoFormGroup,
      fieldsDefinition: this.orderMemoFieldsDefinition.define()
    };
  }
  constructor() {}
  ngOnInit(): void {
    this.orderMemoFieldsDefinition = new OrderMemoFieldsDefinition();
  }
}
