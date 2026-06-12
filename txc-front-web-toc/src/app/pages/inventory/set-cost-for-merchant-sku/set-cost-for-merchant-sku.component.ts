import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-set-cost-for-merchant-sku',
  templateUrl: './set-cost-for-merchant-sku.component.html',
  styleUrls: ['./set-cost-for-merchant-sku.component.scss']
})
export class SetCostForMerchantSkuComponent implements OnInit {

  cost_list : any[] = [{
    merchant: "Edenred Demo",
    merchant_sku : "DSFEWFD1213244SD",
    merchant_sku_name : "Edenred Voucher e-Gift 1,000"
  },
  {
    merchant: "Merchant Name",
    merchant_sku : "Merchant SKU No.",
    merchant_sku_name : "Merchant SKU Name"
  },
  {
    merchant: "Merchant Name",
    merchant_sku : "Merchant SKU No.",
    merchant_sku_name : "Merchant SKU Name"
  }];
  constructor(private router : Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content:any): void{
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {
      
    }, (reason:any) => {
      
    });
  }

  redirectOverview(modal:any):void{
    modal.close('Close click')
    this.router.navigate(['/inventory/overview']);
  }

}
