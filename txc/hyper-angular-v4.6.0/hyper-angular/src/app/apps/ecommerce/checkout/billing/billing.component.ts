import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Select2Data } from 'ng-select2-component';

// data
import { COUNTRIES } from '../data';

@Component({
  selector: 'app-ecommerce-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {


  countries!: Select2Data;
  selectedCountry: string = "IN";

  @Output() activeShipping = new EventEmitter<any>();


  constructor () {
    // initialize country list
    this.countries = COUNTRIES;
  }

  ngOnInit(): void {
  }

  /**
   *  on billing form submit
   */
  onBillingFormSubmit(): void {
    this.activeShipping.emit(2);
  }

}
