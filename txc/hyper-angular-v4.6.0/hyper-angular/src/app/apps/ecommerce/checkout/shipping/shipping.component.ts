import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Select2Data } from 'ng-select2-component';

// data
import { COUNTRIES } from '../data';

@Component({
  selector: 'app-ecommerce-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  countries!: Select2Data;
  @Output() activePayment = new EventEmitter<any>();
  constructor () {
    // initialize country list
    this.countries = COUNTRIES;
  }

  ngOnInit(): void {
  }

  /**
   * on billing form submit
   */
  onShippingFormSubmit(): void {
    this.activePayment.emit(3);
  }

}
