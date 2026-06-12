import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { CreateProjectComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { GanttComponent } from './gantt/gantt.component';
import { ProjectListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'list', component: ProjectListComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'new', component: CreateProjectComponent },
  { path: 'gantt', component: GanttComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
