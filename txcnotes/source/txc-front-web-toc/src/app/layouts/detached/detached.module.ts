import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// shared module
import { SharedModule } from '../shared/shared.module';

// components
import { LayoutComponent } from './layout/layout.component';



@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [LayoutComponent]
})
export class DetachedModule { }
