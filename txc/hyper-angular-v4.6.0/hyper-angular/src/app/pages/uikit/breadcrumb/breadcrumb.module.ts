import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { BreadcrumbRoutingModule } from './breadcrumb-routing.module';

// components
import { BreadcrumbComponent } from './breadcrumb.component';


@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    BreadcrumbRoutingModule
  ]
})
export class BreadcrumbModule { }
