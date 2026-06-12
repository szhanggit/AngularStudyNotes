import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { Profile2Component } from './profile2/profile2.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'profile2', component: Profile2Component }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
