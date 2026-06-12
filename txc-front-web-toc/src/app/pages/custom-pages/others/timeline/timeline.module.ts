import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../../../shared/page-title/page-title.module';
import { TimelineRoutingModule } from './timeline-routing.module';

// components
import { TimelineComponent } from './timeline.component';


@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    TimelineRoutingModule
  ]
})
export class TimelineModule { }
