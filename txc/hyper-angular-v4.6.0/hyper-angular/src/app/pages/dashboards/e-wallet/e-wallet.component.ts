import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { MONEYHISTORY, STATISTICSDATA, TRANSACTIONS, WATCHLIST } from './data';
import { ChartStatisticsItem, MoneyHistory, Transaction, WatchlistItem } from './e-wallet.model';

@Component({
  selector: 'app-dashboard-e-wallet',
  templateUrl: './e-wallet.component.html',
  styleUrls: ['./e-wallet.component.scss']
})
export class EWalletComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  chartStatistics: ChartStatisticsItem[] = [];
  watchList: WatchlistItem[] = [];
  moneyHistory: MoneyHistory[] = [];
  transactions: Transaction[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Dashboard', path: '/' }, { label: 'E-Wallet', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.chartStatistics = STATISTICSDATA;
    this.watchList = WATCHLIST;
    this.moneyHistory = MONEYHISTORY;
    this.transactions = TRANSACTIONS;
  }


}
