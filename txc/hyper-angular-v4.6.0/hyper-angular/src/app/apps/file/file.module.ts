import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { FileRoutingModule } from './file-routing.module';

// components
import { QuickAccessComponent } from './quick-access/quick-access.component';
import { RecentFileComponent } from './recent-file/recent-file.component';
import { FileComponent } from './file.component';


@NgModule({
  declarations: [
    FileComponent,
    QuickAccessComponent,
    RecentFileComponent
  ],
  imports: [
    CommonModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    NgbTooltipModule,
    PageTitleModule,
    FileRoutingModule
  ],
  exports: [QuickAccessComponent,
    RecentFileComponent]
})
export class FileModule { }
