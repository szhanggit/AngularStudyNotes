import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
  { path: 'social', loadChildren: () => import('./social/social.module').then(m => m.SocialModule) },
  { path: 'file', loadChildren: () => import('./file/file.module').then(m => m.FileModule) },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  { path: 'projects', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
