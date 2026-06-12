import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { ReadMailComponent } from './read-mail/read-mail.component';

const routes: Routes = [
  { path: 'inbox', component: InboxComponent },
  { path: 'read', component: ReadMailComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
