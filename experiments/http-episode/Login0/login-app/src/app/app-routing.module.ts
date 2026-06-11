import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "./core/auth.guard.service";

const routes: Routes = [
  { path: 'landing'
  , canActivate: [AuthGuardService]
  , loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) }, 
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
