import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortablejsModule } from 'ngx-sortablejs';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { DragdropRoutingModule } from './dragdrop-routing.module';

// components
import { DragdropComponent } from './dragdrop.component';


@NgModule({
  declarations: [
    DragdropComponent
  ],
  imports: [
    CommonModule,
    SortablejsModule,
    PageTitleModule,
    DragdropRoutingModule
  ]
})
export class DragdropModule { }
