import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AuthGuard } from "./auth.guard";


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [AuthGuard]
})
export class AdminModule { }
