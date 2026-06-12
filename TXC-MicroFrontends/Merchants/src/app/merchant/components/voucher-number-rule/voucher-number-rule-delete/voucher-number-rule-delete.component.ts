import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-voucher-number-rule-delete',
  templateUrl: './voucher-number-rule-delete.component.html',
  styleUrls: ['./voucher-number-rule-delete.component.scss']
})
export class VoucherNumberRuleDeleteComponent implements OnInit {
  @Input() ruleName!: string;
	constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
