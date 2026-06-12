import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { AvatarsRoutingModule } from './avatars-routing.module';

// components
import { AvatarsComponent } from './avatars.component';


@NgModule({
  declarations: [
    AvatarsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    AvatarsRoutingModule
  ]
})
export class AvatarsModule { }
