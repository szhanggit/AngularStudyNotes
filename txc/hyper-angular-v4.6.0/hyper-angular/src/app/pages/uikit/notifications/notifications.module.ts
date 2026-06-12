import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NotificationsRoutingModule } from './notifications-routing.module';

// components
import { NotificationsComponent } from './notifications.component';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    PageTitleModule,
    NotificationsRoutingModule
  ]
})
export class NotificationsModule { }
