import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

// enviroment variables
import { environment } from 'src/environments/environment';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { GmapRoutingModule } from './gmap-routing.module';

// components
import { GmapComponent } from './gmap.component';


@NgModule({
  declarations: [
    GmapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAPS_API_KEY
    }),
    PageTitleModule,
    GmapRoutingModule
  ]
})
export class GmapModule { }
