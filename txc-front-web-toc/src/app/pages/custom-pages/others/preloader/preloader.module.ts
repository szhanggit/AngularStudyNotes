import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { PreloaderRoutingModule } from './preloader-routing.module';

// components
import { PreloaderComponent } from './preloader.component';



@NgModule({
  declarations: [
    PreloaderComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    NgApexchartsModule,
    NgbDropdownModule,
    UiModule,
    WidgetModule,
    PreloaderRoutingModule
  ]
})
export class PreloaderModule { }
