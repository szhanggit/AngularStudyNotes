import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadRemainingVoucherDetailsComponent } from './model/download-remaining-voucher-details/download-remaining-voucher-details.component';
import { EditAdditionalInfoComponent } from './model/edit-additional-info/edit-additional-info.component';
import { EditDateInfoComponent } from './model/edit-date-info/edit-date-info.component';
import { EditMerchantSkuNameComponent } from './model/edit-merchant-sku-name/edit-merchant-sku-name.component';
import { EditVoucherWatermarkRuleComponent } from './model/edit-voucher-watermark-rule/edit-voucher-watermark-rule.component';
import { ViewAllRelatedProductCodeComponent } from './model/view-all-related-product-code/view-all-related-product-code.component';
import { ViewDownloadHistoryComponent } from './model/view-download-history/view-download-history.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
  }

  openEditMerchantSkuName(){
    this.modalService.open(EditMerchantSkuNameComponent).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
    
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   console.log('Closed with: ${result}');
    // }, (reason) => {
    //   console.log("Dismissed ${this.getDismissReason(reason)}");
    // });
  }

  openEditAdditionalInfo(){
    this.modalService.open(EditAdditionalInfoComponent).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }

  openEditVoucherWatermarkRule(){
    this.modalService.open(EditVoucherWatermarkRuleComponent).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }

  openViewAllRelatedProductCode(){
    this.modalService.open(ViewAllRelatedProductCodeComponent,{scrollable : true, size : 'lg'}).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }

  openDownloadRemainingVoucherDetails(){
    this.modalService.open(DownloadRemainingVoucherDetailsComponent).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }

  openEditDateInfo(){
    this.modalService.open(EditDateInfoComponent).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }

  openViewDownloadHistory(){
    this.modalService.open(ViewDownloadHistoryComponent,{scrollable:true,size:'xl'}).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }

  openViewInventoryDetail() {
    console.log('aetest');
    this.router.navigateByUrl('/merchant-sku/view-inventory-details');
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
