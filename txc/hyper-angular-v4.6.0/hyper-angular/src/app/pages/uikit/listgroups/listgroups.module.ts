import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ListgroupsRoutingModule } from './listgroups-routing.module';

// components
import { ListgroupsComponent } from './listgroups.component';


@NgModule({
  declarations: [
    ListgroupsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    ListgroupsRoutingModule
  ]
})
export class ListgroupsModule { }
