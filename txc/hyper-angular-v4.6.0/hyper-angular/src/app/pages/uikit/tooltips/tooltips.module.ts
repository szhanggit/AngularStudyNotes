import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TooltipsRoutingModule } from './tooltips-routing.module';

// components
import { TooltipsComponent } from './tooltips.component';


@NgModule({
  declarations: [
    TooltipsComponent
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
    PageTitleModule,
    TooltipsRoutingModule
  ]
})
export class TooltipsModule { }
