import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SortablejsModule } from 'ngx-sortablejs';
import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { TasksRoutingModule } from './tasks-routing.module';

// components
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { KanbanComponent } from './kanban/kanban.component';
import { TaskDetailComponent } from './list/task-detail/task-detail.component';


@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    KanbanComponent,
    TaskDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SortablejsModule,
    QuillModule,
    NgbModule,
    NgxDropzoneModule,
    PageTitleModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
