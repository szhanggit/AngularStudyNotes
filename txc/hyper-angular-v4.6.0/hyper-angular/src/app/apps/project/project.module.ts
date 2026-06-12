import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { Select2Module } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SimplebarAngularModule } from 'simplebar-angular';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { ProjectRoutingModule } from './project-routing.module';

// components
import { ProjectListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { GanttComponent } from './gantt/gantt.component';
import { CreateProjectComponent } from './create/create.component';


@NgModule({
  declarations: [
    ProjectListComponent,
    DetailsComponent,
    GanttComponent,
    CreateProjectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbButtonsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgChartsModule,
    NgxDropzoneModule,
    Select2Module,
    SimplebarAngularModule,
    PageTitleModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
