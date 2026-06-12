import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorAltComponent } from './error-alt.component';

const routes: Routes = [{ path: '', component: ErrorAltComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorAltRoutingModule { }
