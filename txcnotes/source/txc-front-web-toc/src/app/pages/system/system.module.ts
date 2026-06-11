
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SystemRoutingModule } from './system-routing.module';
import { VendorService } from './services/vendor.service';
import { CreateVendorComponent } from './components/create-vendor/create-vendor.component';
import { EditVendorComponent } from './components/edit-vendor/edit-vendor.component';

@NgModule({
  declarations: [
    CreateVendorComponent,
    VendorListComponent,
    EditVendorComponent   
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SystemRoutingModule,
    HttpClientModule,
    NgbTypeaheadModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    SimplebarAngularModule,
    SortablejsModule
  ],
  providers:[
    VendorService
  ]
})
export class SystemModule { }
