import { Component, Input, OnInit } from '@angular/core';
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { MoneyHistory } from '../e-wallet.model';

@Component({
  selector: 'app-wallet-money-history',
  templateUrl: './wallet-money-history.component.html',
  styleUrls: ['./wallet-money-history.component.scss']
})
export class WalletMoneyHistoryComponent implements OnInit {

  dropdownOptions: CardDropdownOption[] = [];
  @Input() moneyHistory: MoneyHistory[] = [];

  constructor () { }

  ngOnInit(): void {
    this.dropdownOptions = [
      { label: 'Refresh', icon: 'mdi mdi-cached' },
      { label: 'Edit', icon: 'mdi mdi-circle-edit-outline' },
      { label: 'Remove', icon: 'mdi mdi-delete-outline', variant: 'danger' },
    ];
  }

}
