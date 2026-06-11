import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbasicexComponent } from './navbasicex/navbasicex.component';
import { TemplateoutletComponent } from './templateoutlet/templateoutlet.component';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateoutletComponent,
    ModalContentComponent,
    ModalBasicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
