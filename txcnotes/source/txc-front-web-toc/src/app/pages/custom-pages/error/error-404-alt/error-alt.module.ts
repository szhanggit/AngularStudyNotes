import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../../../shared/page-title/page-title.module';
import { ErrorAltRoutingModule } from './error-alt-routing.module';

// components
import { ErrorAltComponent } from './error-alt.component';


@NgModule({
  declarations: [
    ErrorAltComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    ErrorAltRoutingModule
  ]
})
export class ErrorAltModule { }
