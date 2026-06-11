import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbAlertModule, NgbDatepickerModule, NgbCollapseModule, NgbTimepickerModule, NgbRatingModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasicFormOneComponent } from './basic-form-one/basic-form-one.component';
import { BasicFormTwoComponent } from './basic-form-two/basic-form-two.component';
import { BasicFormThreeComponent } from './basic-form-three/basic-form-three.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { FormArrayNameExComponent } from './form-array-name-ex/form-array-name-ex.component';
import { FormArrayExComponent } from './form-array-ex/form-array-ex.component';
import { DateCtrlComponent } from './date-ctrl/date-ctrl.component';
import { RatingCtrlComponent } from './rating-ctrl/rating-ctrl.component';
import { UpimgComponent } from './upimg/upimg.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicFormOneComponent,
    BasicFormTwoComponent,
    BasicFormThreeComponent,
    FormArrayNameExComponent,
    FormArrayExComponent,
    DateCtrlComponent,
    RatingCtrlComponent,
    UpimgComponent
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
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
