import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { PopoversRoutingModule } from './popovers-routing.module';

// components
import { PopoversComponent } from './popovers.component';


@NgModule({
  declarations: [
    PopoversComponent
  ],
  imports: [
    CommonModule,
    NgbPopoverModule,
    PageTitleModule,
    PopoversRoutingModule
  ]
})
export class PopoversModule { }
