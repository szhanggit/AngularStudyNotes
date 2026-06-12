import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { BasicRoutingModule } from './basic-routing.module';

// components
import { BasicComponent } from './basic.component';


@NgModule({
  declarations: [
    BasicComponent
  ],
  imports: [
    CommonModule,
    NgbProgressbarModule,
    PageTitleModule,
    BasicRoutingModule
  ]
})
export class BasicModule { }
