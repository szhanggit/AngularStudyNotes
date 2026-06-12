import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../../../shared/page-title/page-title.module';
import { StarterRoutingModule } from './starter-routing.module';

// components
import { StarterComponent } from './starter.component';


@NgModule({
  declarations: [
    StarterComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    StarterRoutingModule
  ]
})
export class StarterModule { }
