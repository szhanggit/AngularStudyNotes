import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MerchantModule } from './merchant/merchant.module';
import { AppRoutingModule } from './app-routing.module';
import { MessageModule } from './message/message.module';
import { AppComponent } from './app.component';

import { TermsGuard } from "./terms.guard";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MerchantModule,
    MessageModule
  ],
  providers: [TermsGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
