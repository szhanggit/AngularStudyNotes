import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../e-wallet.model';

@Component({
  selector: 'app-wallet-transaction-list',
  templateUrl: './wallet-transaction-list.component.html',
  styleUrls: ['./wallet-transaction-list.component.scss']
})
export class WalletTransactionListComponent implements OnInit {

  @Input() transactions: Transaction[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
