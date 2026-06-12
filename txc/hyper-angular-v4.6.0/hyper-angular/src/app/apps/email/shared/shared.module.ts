import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';




@NgModule({
  declarations: [
    LeftSidebarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    QuillModule,
    NgbProgressbarModule,
    NgbDropdownModule,
  ],
  exports: [
    LeftSidebarComponent, TopbarComponent
  ]
})
export class SharedModule { }
