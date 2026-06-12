import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgChartsModule } from 'ng2-charts';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { DashboardRoutingModule } from './dashboards-routing.module';

// components
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProjectsComponent } from './projects/projects.component';
import { EWalletComponent } from './e-wallet/e-wallet.component';
import { WalletCardComponent } from './e-wallet/wallet-card/wallet-card.component';
import { WalletWatchlistComponent } from './e-wallet/wallet-watchlist/wallet-watchlist.component';
import { WalletStatisticsComponent } from './e-wallet/wallet-statistics/wallet-statistics.component';
import { WalletBalanceStatusComponent } from './e-wallet/wallet-balance-status/wallet-balance-status.component';
import { WalletMoneyHistoryComponent } from './e-wallet/wallet-money-history/wallet-money-history.component';
import { WalletMerchantsComponent } from './e-wallet/wallet-merchants/wallet-merchants.component';
import { WalletTransactionListComponent } from './e-wallet/wallet-transaction-list/wallet-transaction-list.component';


@NgModule({
  declarations: [
    EcommerceComponent,
    AnalyticsComponent,
    ProjectsComponent,
    EWalletComponent,
    WalletCardComponent,
    WalletWatchlistComponent,
    WalletStatisticsComponent,
    WalletBalanceStatusComponent,
    WalletMoneyHistoryComponent,
    WalletMerchantsComponent,
    WalletTransactionListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbNavModule,
    NgbTooltipModule,
    NgChartsModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    WidgetModule,
    PageTitleModule,
    DashboardRoutingModule,
  ],
  exports: [
    EcommerceComponent,
    AnalyticsComponent,
    ProjectsComponent
  ]
})
export class DashboardModule { }
