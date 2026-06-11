import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from "./admin/auth.component";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuard } from "./admin/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "/auth", pathMatch: 'full' },
  { path: "auth", component: AuthComponent },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "/auth" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
