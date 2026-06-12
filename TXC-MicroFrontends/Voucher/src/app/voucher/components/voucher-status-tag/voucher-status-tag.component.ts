import { Component, Input, OnInit } from '@angular/core';
import { VoucherStatusEnum } from '../../enum/voucher-status.enum';


@Component({
  selector: 'voucher-status-tag',
  templateUrl: './voucher-status-tag.component.html',
  styleUrls: ['./voucher-status-tag.component.scss']
})
export class VoucherStatusTagComponent implements OnInit {
  readonly voucherStatusEnum = VoucherStatusEnum;
  @Input() status: VoucherStatusEnum = this.voucherStatusEnum.ACTIVATED;
  tag: VoucherStatusEnum = this.voucherStatusEnum.BLOCKED;
  constructor() { }

  ngOnInit(): void {
    this.tag = this.status;
  }

}
