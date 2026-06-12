import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ButtonsRoutingModule } from './buttons-routing.module';

// components
import { ButtonsComponent } from './buttons.component';


@NgModule({
  declarations: [
    ButtonsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbButtonsModule,
    PageTitleModule,
    ButtonsRoutingModule
  ]
})
export class ButtonsModule { }
