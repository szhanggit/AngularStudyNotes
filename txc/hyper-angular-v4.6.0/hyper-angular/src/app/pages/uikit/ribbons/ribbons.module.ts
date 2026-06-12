import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RibbonsRoutingModule } from './ribbons-routing.module';
import { RibbonsComponent } from './ribbons.component';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';


@NgModule({
  declarations: [
    RibbonsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    RibbonsRoutingModule
  ]
})
export class RibbonsModule { }
