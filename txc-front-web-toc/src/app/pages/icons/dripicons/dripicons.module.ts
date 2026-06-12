import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DripiconsRoutingModule } from './dripicons-routing.module';

// components
import { DripiconsComponent } from './dripicons.component';


@NgModule({
  declarations: [
    DripiconsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    DripiconsRoutingModule
  ]
})
export class DripiconsModule { }
