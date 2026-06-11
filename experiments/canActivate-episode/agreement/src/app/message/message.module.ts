import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { MessageService } from "./message.service";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule, RouterModule, BrowserModule
  ],
  exports: [MessageComponent],
  providers: [MessageService]
})
export class MessageModule { }
