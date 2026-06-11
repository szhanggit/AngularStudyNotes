import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientCreateComponent } from './components/client-create/client-create.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ToastModule } from '@txc-angular/component-library';
import { ClientEditComponent } from './components/client-edit/client-edit.component';
import { ClientHistoryComponent } from './components/client-history-list/client-history-list.component';
import { SendSecurityKeyComponent } from './components/send-security-key/send-security-key.component';
import { ClientQuotationListComponent } from './components/client-quotation-list/client-quotation-list.component';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
@NgModule({
  declarations: [
    ClientListComponent,
    ClientDetailsComponent,
    ClientCreateComponent,
    ClientFormComponent,
    ClientEditComponent,
    ClientHistoryComponent,
    SendSecurityKeyComponent,
    ClientQuotationListComponent,
    QuotationListComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ]
})
export class ClientModule { }
