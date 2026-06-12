import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { AccordionsRoutingModule } from './accordions-routing.module';

// components
import { AccordionsComponent } from './accordions.component';


@NgModule({
  declarations: [
    AccordionsComponent
  ],
  imports: [
    CommonModule,
    NgbAccordionModule,
    NgbCollapseModule,
    PageTitleModule,
    AccordionsRoutingModule
  ]
})
export class AccordionsModule { }
