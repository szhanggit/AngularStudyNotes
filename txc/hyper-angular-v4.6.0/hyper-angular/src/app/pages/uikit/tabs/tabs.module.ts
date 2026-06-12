import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TabsRoutingModule } from './tabs-routing.module';

// components
import { TabsComponent } from './tabs.component';


@NgModule({
  declarations: [
    TabsComponent
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    PageTitleModule,
    TabsRoutingModule
  ]
})
export class TabsModule { }
