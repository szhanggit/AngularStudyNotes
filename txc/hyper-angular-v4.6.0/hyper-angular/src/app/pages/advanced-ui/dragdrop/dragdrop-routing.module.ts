import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragdropComponent } from './dragdrop.component';

const routes: Routes = [{ path: '', component: DragdropComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DragdropRoutingModule { }
