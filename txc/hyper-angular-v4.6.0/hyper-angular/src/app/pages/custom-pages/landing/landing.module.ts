import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { LandingRoutingModule } from './landing-routing.module';

// components
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { ServicesComponent } from './services/services.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { FeaturesComponent } from './features/features.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';
import { FaqComponent } from './faq/faq.component';
import { PricingComponent } from './pricing/pricing.component';
import { LandingComponent } from './landing.component';





@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    LayoutsComponent,
    FeaturesComponent,
    ContactUsComponent,
    FooterComponent,
    FaqComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    WidgetModule,
    LandingRoutingModule
  ],
  exports: [
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    LayoutsComponent,
    FeaturesComponent,
    FaqComponent,
    PricingComponent,
    ContactUsComponent,
    FooterComponent
  ]
})
export class LandingModule { }
