import { Component, Input, OnInit } from '@angular/core';

// type
import { TransactionItem } from './transaction.model';

@Component({
  selector: 'app-widget-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  @Input() transactionList: TransactionItem[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
