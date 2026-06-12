import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { CardsRoutingModule } from './cards-routing.module';

// components
import { CardsComponent } from './cards.component';



@NgModule({
  declarations: [
    CardsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    UiModule,
    CardsRoutingModule
  ]
})
export class CardsModule { }
