import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { AdvancedTableModule } from '../../../shared/advanced-table/advanced-table.module';
import { AdvancedRoutingModule } from './advanced-routing.module';

// components
import { AdvancedComponent } from './advanced.component';



@NgModule({
  declarations: [
    AdvancedComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    AdvancedTableModule,
    AdvancedRoutingModule
  ]
})
export class AdvancedModule { }
