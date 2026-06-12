import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { WidgetsRoutingModule } from './widgets-routing.module';

// components
import { WidgetsComponent } from './widgets.component';




@NgModule({
  declarations: [
    WidgetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    WidgetModule,
    PageTitleModule,
    WidgetsRoutingModule
  ]
})
export class WidgetsModule { }
