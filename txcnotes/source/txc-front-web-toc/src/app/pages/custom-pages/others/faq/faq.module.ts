import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../../../shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { FaqRoutingModule } from './faq-routing.module';

// components
import { FaqComponent } from './faq.component';



@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    WidgetModule,
    FaqRoutingModule
  ]
})
export class FaqModule { }
