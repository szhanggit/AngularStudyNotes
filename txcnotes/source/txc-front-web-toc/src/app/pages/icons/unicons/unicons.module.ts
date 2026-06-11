import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { UniconsRoutingModule } from './unicons-routing.module';

// components
import { UniconsComponent } from './unicons.component';


@NgModule({
  declarations: [
    UniconsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    UniconsRoutingModule
  ]
})
export class UniconsModule { }
