import { Component, OnInit } from '@angular/core';

// types
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Order } from '../shared/crm.model';

// data
import { ORDERS } from './data';

@Component({
  selector: 'app-crm-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class CRMOrderListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  orders: Order[] = [];
  searchTerm: string = '';
  status: string = "";

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Order List', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches order list
   */
  _fetchData(): void {
    this.orders = [...ORDERS];
  }


  /**
 * Table Data Match with Search input
 * @param tableRow Table row
 * @param term Search the value
 */
  matches(tableRow: Order, term: string) {
    return tableRow.orderId?.toLowerCase().includes(term)
      || tableRow.orderDate?.toLowerCase().includes(term)
      || tableRow.customer.name?.toLowerCase().includes(term)
      || tableRow.address.city?.toLowerCase().includes(term)
      || tableRow.address.country?.toLowerCase().includes(term)
      || tableRow.project?.toLowerCase().includes(term)
      || tableRow.orderStatus?.toLocaleLowerCase().includes(term);
  }


  /**
   * Search Method
  */
  searchData(): void {

    if (this.searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = ORDERS;
      //  filter
      updatedData = updatedData.filter(product => this.matches(product, this.searchTerm));
      this.orders = updatedData;
    }

  }

}
