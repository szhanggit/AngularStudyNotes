import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { ScrollbarRoutingModule } from './scrollbar-routing.module';

// component
import { ScrollbarComponent } from './scrollbar.component';


@NgModule({
  declarations: [
    ScrollbarComponent
  ],
  imports: [
    CommonModule,
    SimplebarAngularModule,
    PageTitleModule,
    ScrollbarRoutingModule
  ]
})
export class ScrollbarModule { }
