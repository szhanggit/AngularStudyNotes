import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  @Input() detailsFormGroup!: FormGroup;
  @Output() editStep = new EventEmitter<number>();

  productDetailsCollapsed = false;
  pricingContractExpiryCollapsed = false;
  productTemplateImageCollapsed = false;
  externalPropertiesCollapsed = false;

  // forms
  get detailsControls() {
    return this.detailsFormGroup.controls;
  }

  constructor() { }

  ngOnInit(): void {
    
  }

  jumpStep(step: number) {
    this.editStep.emit(step);
  }
}
