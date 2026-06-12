import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { MediaLibraryListComponent } from './components/media-library/media-library-list/media-library-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from '@txc-angular/component-library';
import { TemplateListComponent } from './components/template/template-list/template-list.component';
import { ViewMediaComponent } from './components/media-library/view-media/view-media.component';
import { Select2Module } from 'ng-select2-component';
import { TemplatesubtypePipe } from './pipes/templatesubtype.pipe';
import { TemplateListTableComponent } from './components/template/template-list/template-list-table/template-list-table.component';
import { NoResultComponent } from './components/common/no-result/no-result.component';

@NgModule({
  declarations: [
    MediaLibraryListComponent,
    TemplateListComponent,
    ViewMediaComponent,
    TemplatesubtypePipe,
    TemplateListTableComponent,
    NoResultComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    Select2Module
  ]
})
export class SystemModule { }
