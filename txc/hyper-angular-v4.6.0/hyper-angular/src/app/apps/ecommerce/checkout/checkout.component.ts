import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  active = 1;
  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Checkout', path: '/', active: true }];
  }

  // changes active tabs
  changeActiveID(id: number): void {
    this.active = id;
  }

}
