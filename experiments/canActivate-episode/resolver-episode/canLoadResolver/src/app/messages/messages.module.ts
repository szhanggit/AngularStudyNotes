import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { MessageService } from "./message.service";

@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule, BrowserModule, RouterModule
  ],
  exports: [MessageComponent],
  providers: [MessageService]
})
export class MessagesModule { }
