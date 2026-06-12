import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { RatingsRoutingModule } from './ratings-routing.module';

// components
import { RatingsComponent } from './ratings.component';


@NgModule({
  declarations: [
    RatingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbRatingModule,
    PageTitleModule,
    RatingsRoutingModule
  ]
})
export class RatingsModule { }
