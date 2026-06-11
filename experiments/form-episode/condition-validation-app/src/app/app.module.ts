import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbAlertModule, NgbDatepickerModule, NgbCollapseModule, NgbTimepickerModule, NgbRatingModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AppComponent } from './app.component';
import { BasicFormOneComponent } from './basic-form-one/basic-form-one.component';
import { BasicFormTwoComponent } from './basic-form-two/basic-form-two.component';
import { BasicFormThreeComponent } from './basic-form-three/basic-form-three.component';
import { BasicFormThreeV2Component } from './basic-form-three.v2/basic-form-three.v2.component';
import { BasicFormThreeV3Component } from './basic-form-three.v3/basic-form-three.v3.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicFormOneComponent,
    BasicFormTwoComponent,
    BasicFormThreeComponent,
    BasicFormThreeV2Component,
    BasicFormThreeV3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCollapseModule,
    NgbDatepickerModule, 
    NgbAlertModule, 
    FormsModule, 
    ReactiveFormsModule,
    NgbTimepickerModule,
    NgbRatingModule,
    NgbDropdownModule,
    JsonPipe,
    NgbTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
