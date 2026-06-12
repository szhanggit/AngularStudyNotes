import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SpinnersRoutingModule } from './spinners-routing.module';

// components
import { SpinnersComponent } from './spinners.component';


@NgModule({
  declarations: [
    SpinnersComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    SpinnersRoutingModule
  ]
})
export class SpinnersModule { }
