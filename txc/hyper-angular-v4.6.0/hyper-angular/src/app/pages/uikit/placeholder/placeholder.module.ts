import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { PlaceholderRoutingModule } from './placeholder-routing.module';

// components
import { PlaceholderComponent } from './placeholder.component';


@NgModule({
  declarations: [
    PlaceholderComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    PlaceholderRoutingModule
  ]
})
export class PlaceholderModule { }
