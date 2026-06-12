import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { ProfileRoutingModule } from './profile-routing.module';

// components
import { ProfileComponent } from './profile/profile.component';
import { Profile2Component } from './profile2/profile2.component';
import { UserboxComponent } from './profile/userbox/userbox.component';
import { SellerInfoComponent } from './profile/seller-info/seller-info.component';
import { RevenueComponent } from './profile/revenue/revenue.component';
import { ProductsComponent } from './profile/products/products.component';
import { AboutComponent } from './profile2/about/about.component';
import { TimelineComponent } from './profile2/timeline/timeline.component';
import { SettingsComponent } from './profile2/settings/settings.component';
import { Userbox2Component } from './profile2/userbox/userbox.component';


@NgModule({
  declarations: [
    ProfileComponent,
    Profile2Component,
    UserboxComponent,
    SellerInfoComponent,
    RevenueComponent,
    ProductsComponent,
    Userbox2Component,
    AboutComponent,
    TimelineComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbModule,
    PageTitleModule,
    NgChartsModule,
    WidgetModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
