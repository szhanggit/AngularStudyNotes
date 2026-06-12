import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { KanbanComponent } from './kanban/kanban.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'kanban', component: KanbanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
