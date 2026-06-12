import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { CartItem, CartSummary } from '../shared/models';

// data
import { cartItems } from '../shared/data';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  cartItems: CartItem[] = [];
  cartSummary!: CartSummary;
  constructor () { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Shopping Cart', path: '/', active: true }];

    // get cart items
    this._fetchData();

    // calculate initial cart summary
    this.calculateSummary();
  }

  /**
   * fetches cart items
   */
  _fetchData(): void {
    this.cartItems = [...cartItems];
  }

  /**
   * calulates cart summary
   */
  calculateSummary(): void {
    let gross_total: number = 0;
    let item: CartItem;
    for (item of this.cartItems) {
      gross_total = gross_total + item.total;
    }
    this.cartSummary = {
      gross_total: gross_total,
      discount: 157.11,
      shipping_charge: 25,
      tax: 19.22,
    }
    this.cartSummary.net_total = (this.cartSummary.gross_total! - (this.cartSummary.discount ? this.cartSummary.discount : 0) + this.cartSummary.shipping_charge! + this.cartSummary.tax!);
  }

  /**
   * on change of cart item quantity
   * @param item cart item
   */
  onQuantityChange(item: CartItem): void {
    item.total = item.qty * item.price;
    const items = [...this.cartItems];
    const idx = items.findIndex(i => i['id'] === item['id']);
    items[idx].total = items[idx].price * items[idx].qty;
    this.cartItems = items;
    this.calculateSummary();
  }

  /**
   * remove item from cart
   * @param item cart item to be removed
   */
  onItemRemove(item: CartItem): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    // update cart summary
    this.calculateSummary();
  }

}
