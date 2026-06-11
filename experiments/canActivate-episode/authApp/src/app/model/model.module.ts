import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestDataSource } from "./rest.datasource";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule, HttpClientModule
  ],
  providers: [RestDataSource, AuthService]
})
export class ModelModule { }
