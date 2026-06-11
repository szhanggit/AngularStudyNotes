import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MerchantComponent } from './merchant/merchant.component';
import { MY_TOKEN } from './tokens';

@NgModule({
  declarations: [
    AppComponent,
    MerchantComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    /*{
		provide: MY_TOKEN,
		useValue: 'Token Value'
	}*/
],
  bootstrap: [AppComponent]
})

export class AppModule { }
