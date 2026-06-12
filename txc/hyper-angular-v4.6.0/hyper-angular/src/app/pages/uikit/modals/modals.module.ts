import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ModalsRoutingModule } from './modals-routing.module';

// components
import { ModalsComponent } from './modals.component';


@NgModule({
  declarations: [
    ModalsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    PageTitleModule,
    ModalsRoutingModule
  ]
})
export class ModalsModule { }
