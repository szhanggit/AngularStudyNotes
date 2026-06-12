import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PRODUCT_CONSTANTS } from '../../../constants/product-constants';
import { ProductType } from '../../../models/product-type.model';


@Component({
  selector: 'app-product-wizard-stepper',
  templateUrl: './product-wizard-stepper.component.html',
  styleUrls: ['./product-wizard-stepper.component.scss']
})
export class ProductWizardStepperComponent implements OnInit {
  @Input() step = 0;
  @Input() selectedType!: ProductType;
  @Output() stepperChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  get productSteps(): string[] {
    if (!PRODUCT_CONSTANTS.PRODUCT_TYPE_EXCEPTION.includes(this.selectedType.key)) {
      return PRODUCT_CONSTANTS.PRODUCT_STEPS;
    }

    return PRODUCT_CONSTANTS.MASTER_PRODUCT_STEPS;
  }

  jumpStep(nextStep: number) {
    if (this.step > nextStep) {
      this.step = nextStep;
      this.stepperChanged.emit(nextStep);
    }
  }

}
