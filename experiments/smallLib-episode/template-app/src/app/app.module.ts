import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { NavbasicexComponent } from './navbasicex/navbasicex.component';
import { TemplateoutletComponent } from './templateoutlet/templateoutlet.component';
import { Toggleex1Component } from './toggleex1/toggleex1.component';
import { Toggleex2Component } from './toggleex2/toggleex2.component';
import { Tooltip1Component } from './tooltip1/tooltip1.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateoutletComponent,
    Toggleex1Component,
    Toggleex2Component,
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
