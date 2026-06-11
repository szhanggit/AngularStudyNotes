import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../../../shared/page-title/page-title.module';
import { InvoiceRoutingModule } from './invoice-routing.module';

// components
import { InvoiceComponent } from './invoice.component';


@NgModule({
  declarations: [
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
