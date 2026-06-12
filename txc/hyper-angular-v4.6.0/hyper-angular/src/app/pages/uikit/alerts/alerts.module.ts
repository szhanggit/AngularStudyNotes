import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { AlertsRoutingModule } from './alerts-routing.module';

// components
import { AlertsComponent } from './alerts.component';
import { GlobalConfiguredAlertComponent } from './global-configured-alert/global-configured-alert.component';
import { SelfClosingAlertComponent } from './self-closing-alert/self-closing-alert.component';


@NgModule({
  declarations: [
    AlertsComponent,
    GlobalConfiguredAlertComponent,
    SelfClosingAlertComponent
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    PageTitleModule,
    AlertsRoutingModule
  ]
})
export class AlertsModule { }
