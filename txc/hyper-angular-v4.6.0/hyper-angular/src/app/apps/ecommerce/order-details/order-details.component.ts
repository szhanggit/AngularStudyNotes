import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Order, OrderDetails } from '../shared/models';

// data
import { orders } from '../shared/data';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedOrder!: Order;
  orderDetails!: OrderDetails;

  constructor (private route: ActivatedRoute) { }



  ngOnInit(): void {
    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Order Details', path: '/', active: true }];

    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedOrder = orders.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.selectedOrder = orders[0];
      }
    });
    // get order details
    this._fetchData();
  }

  /**
   * fetches order details
   */
  _fetchData(): void {
    this.orderDetails = {
      id: this.selectedOrder.order_id!,
      order_status: this.selectedOrder.order_status,
      items: [
        { id: 1, name: 'The Military Duffle Bag', quantity: 3, price: 128, total: 384 },
        { id: 2, name: 'Mountain Basket Ball', quantity: 1, price: 199, total: 199 },
        { id: 3, name: 'Wavex Canvas Messenger Bag', quantity: 5, price: 180, total: 900 },
        { id: 4, name: 'The Utility Shirt', quantity: 2, price: 79, total: 158 },
      ],
      summary: [
        {
          id: 1,
          description: "gross_total",
          price: 1641
        },
        {
          id: 2,
          description: "shipping_charge",
          price: 23
        },
        {
          id: 3,
          description: "tax",
          price: 19.22
        },
        {
          id: 4,
          description: "net_total",
          price: 1683.22
        }
      ],
      shipping: {
        provider: 'Stanley Jones',
        address_1: '795 Folsom Ave, Suite 600',
        address_2: 'San Francisco, CA 94107',
        phone: '(123) 456-7890 ',
        mobile: '(+01) 12345 67890',
      },
      billing: {
        type: this.selectedOrder.payment_method!,
        provider: 'Visa ending in 2851',
        valid: '02/2020',
      },
      delivery: {
        provider: 'UPS Delivery',
        order_id: this.selectedOrder.order_id!,
        payment_mode: this.selectedOrder.payment_method!,
      },
    };
  }

}
