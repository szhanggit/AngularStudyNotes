import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessUnitSelectComponent } from './components/business-unit-select/business-unit-select.component';

@NgModule({
  declarations: [
    BusinessUnitSelectComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    BusinessUnitSelectComponent
  ]
})
export class BusinessUnitModule { }
