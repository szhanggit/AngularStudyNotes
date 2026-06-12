import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

// data
import { invoice, invoiceData } from './data';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {


  invoiceData!: invoice;
  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: 'Invoice', path: '/', active: true }];
    this.invoiceData = invoiceData;
  }

}
