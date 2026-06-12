import { Component, OnInit } from '@angular/core';

// type
import { CartItem } from '../../shared/models';

// data
import { cartItems } from '../../shared/data';


@Component({
  selector: 'app-ecommerce-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  cartItems: CartItem[] = [];
  total: number = 0;

  constructor () { }

  ngOnInit(): void {
    // get cart items for checkout
    this._fetchData();
    // calulates total amount for billing
    this.caluculateTotal();
  }

  /**
   * fetches cart items
   */
  _fetchData(): void {
    this.cartItems = [...cartItems];
  }

  /**
   * calulates total amount for billing
   */
  caluculateTotal(): void {
    for (const item of cartItems) {
      this.total = this.total + (item.price * item.qty);
    }
  }




}
