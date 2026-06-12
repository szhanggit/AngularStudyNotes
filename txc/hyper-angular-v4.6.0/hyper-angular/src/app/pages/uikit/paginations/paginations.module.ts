import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { PaginationsRoutingModule } from './paginations-routing.module';

// components
import { PaginationsComponent } from './paginations.component';


@NgModule({
  declarations: [
    PaginationsComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    PageTitleModule,
    PaginationsRoutingModule
  ]
})
export class PaginationsModule { }
