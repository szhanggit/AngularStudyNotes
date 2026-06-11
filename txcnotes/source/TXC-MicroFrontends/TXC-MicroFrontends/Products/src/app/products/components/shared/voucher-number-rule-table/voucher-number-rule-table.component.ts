import { Component, Input, OnInit } from '@angular/core';
import { SKU } from 'src/app/products/models/sku.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { IProgram } from '../../../models/program.model';
@Component({
  selector: 'app-voucher-number-rule-table',
  templateUrl: './voucher-number-rule-table.component.html',
  styleUrls: ['./voucher-number-rule-table.component.scss']
})
export class VoucherNumberRuleTableComponent implements OnInit {
  @Input() program!: IProgram;
  @Input() voucherNumberRuleList!: VoucherNumberRule[];
  @Input() errorMessage!: string;
  @Input() selectedSKU!: SKU | undefined;

  tenant!: string;
  selectedTenantUTC!: string;

  constructor() { }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.tenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }
  }
}
