import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeModule } from './employee/employee.module';
import { UiElementComponent } from './ui-element/ui-element.component';
import { CpcolorParentComponent } from './cpcolor-parent/cpcolor-parent.component';
import { CpthemeComponent } from './cptheme/cptheme.component';
import { NumberParentComponent } from './number-parent/number-parent.component';
import { NumberComponent } from './number/number.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { StopwatchParentComponent } from './stopwatch-parent/stopwatch-parent.component';
import { CpcolorDirective } from './cpcolor.directive';

@NgModule({
  declarations: [
    AppComponent,
    UiElementComponent,
    CpcolorParentComponent,
    CpthemeComponent,
    NumberParentComponent,
    NumberComponent,
    StopwatchComponent,
    StopwatchParentComponent,
    CpcolorDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EmployeeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
