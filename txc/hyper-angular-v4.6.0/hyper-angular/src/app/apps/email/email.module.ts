import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { SharedModule } from './shared/shared.module';
import { EmailRoutingModule } from './email-routing.module';

// components
import { InboxComponent } from './inbox/inbox.component';
import { ReadMailComponent } from './read-mail/read-mail.component';



@NgModule({
  declarations: [
    InboxComponent,
    ReadMailComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    SharedModule,
    EmailRoutingModule
  ]
})
export class EmailModule { }
