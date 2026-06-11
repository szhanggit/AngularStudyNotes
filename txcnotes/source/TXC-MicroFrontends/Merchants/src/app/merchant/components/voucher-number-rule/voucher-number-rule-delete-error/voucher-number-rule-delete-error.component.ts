import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-voucher-number-rule-delete-error',
  templateUrl: './voucher-number-rule-delete-error.component.html',
  styleUrls: ['./voucher-number-rule-delete-error.component.scss']
})
export class VoucherNumberRuleDeleteErrorComponent implements OnInit {
  @Input() errorMessage!: string;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }
}
