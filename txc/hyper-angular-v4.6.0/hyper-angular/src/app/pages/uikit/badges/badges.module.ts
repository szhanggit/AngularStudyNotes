import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { BadgesRoutingModule } from './badges-routing.module';

// components
import { BadgesComponent } from './badges.component';


@NgModule({
  declarations: [
    BadgesComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    BadgesRoutingModule
  ]
})
export class BadgesModule { }
