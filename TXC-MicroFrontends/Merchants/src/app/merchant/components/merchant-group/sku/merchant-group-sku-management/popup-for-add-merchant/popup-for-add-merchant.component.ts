import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MerchantListUI } from 'src/app/merchant/models/merchant-group-sku.model';


@Component({
  selector: 'app-popup-for-add-merchant',
  templateUrl: './popup-for-add-merchant.component.html',
  styleUrls: ['./popup-for-add-merchant.component.scss']
})
export class PopupForAddMerchantComponent implements OnInit {
  @Input() data!: MerchantListUI[];

  merchantList: MerchantListUI[] = [];
  selectedMerchant = new FormControl([0]);

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    const merchantList: MerchantListUI[] = [];
    this.data.forEach(e => {
      if (merchantList.findIndex(exsistMercahnt => exsistMercahnt.merchantId === e.merchantId) < 0) {
        merchantList.push(e);
      }
    });
    this.merchantList = merchantList;
  }

}
