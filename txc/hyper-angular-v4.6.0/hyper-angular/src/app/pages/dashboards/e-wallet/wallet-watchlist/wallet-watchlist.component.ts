import { Component, Input, OnInit } from '@angular/core';
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { WatchlistItem } from '../e-wallet.model';

@Component({
  selector: 'app-wallet-watchlist',
  templateUrl: './wallet-watchlist.component.html',
  styleUrls: ['./wallet-watchlist.component.scss']
})
export class WalletWatchlistComponent implements OnInit {

  @Input() watchList: WatchlistItem[] = [];
  dropdownOptions: CardDropdownOption[] = [];

  constructor () { }

  ngOnInit(): void {
    this.dropdownOptions = [
      { label: 'Refresh', icon: 'mdi mdi-cached' },
      { label: 'Edit', icon: 'mdi mdi-circle-edit-outline' },
      { label: 'Remove', icon: 'mdi mdi-delete-outline', variant: 'danger' },
    ];
  }

}
