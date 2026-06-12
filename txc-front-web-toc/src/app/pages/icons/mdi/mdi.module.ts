import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { MdiRoutingModule } from './mdi-routing.module';

// components
import { MdiComponent } from './mdi.component';


@NgModule({
  declarations: [
    MdiComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    MdiRoutingModule
  ]
})
export class MdiModule { }
