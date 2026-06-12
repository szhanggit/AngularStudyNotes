import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { GridRoutingModule } from './grid-routing.module';

// components
import { GridComponent } from './grid.component';


@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    GridRoutingModule
  ]
})
export class GridModule { }
