import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// shared module
import { SharedModule } from '../shared/shared.module';

// components
import { LayoutComponent } from './layout/layout.component';
import { TopnavComponent } from './topnav/topnav.component';




@NgModule({
  declarations: [
    LayoutComponent,
    TopnavComponent
  ],
  imports: [
    CommonModule,
    NgbCollapseModule,
    NgbDropdownModule,
    RouterModule,
    SharedModule
  ],
  exports: [LayoutComponent, TopnavComponent]
})
export class HorizontalModule { }
