import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { PortletComponent } from './portlet/portlet.component';

@NgModule({
  declarations: [
    PortletComponent
  ],
  imports: [
    CommonModule,
    NgbCollapseModule
  ],
  exports: [
    PortletComponent
  ]
})
export class UiModule { }
