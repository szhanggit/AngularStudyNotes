import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { Tooltip1Component } from './tooltip1/tooltip1.component';

@NgModule({
  declarations: [
    AppComponent,
    Tooltip1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCollapseModule,
    NgbTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }