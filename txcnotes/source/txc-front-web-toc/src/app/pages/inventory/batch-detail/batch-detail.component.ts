import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadRemainingVoucherDetailsComponent } from '../../merchant-sku/detail/model/download-remaining-voucher-details/download-remaining-voucher-details.component';
import { InventoryService } from '../services/inventory.service';
import { RejectReasonComponent } from './model/reject-reason/reject-reason.component';

@Component({
  selector: 'app-batch-detail',
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.scss']
})
export class BatchDetailComponent implements OnInit {

  batch_detail_list : any[] = [];

  constructor(private inventoryService : InventoryService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.inventoryService.BatchDetail_List().subscribe({next:(response:any) => {                           //next() callback
      console.log('response received', response);
      this.batch_detail_list = response;
    },
    error :
    (error) => {                              //error() callback
      debugger;
      console.error('Request failed with error',error)
    }
  });
  }

  onReject(): void{
    this.modalService.open(RejectReasonComponent).result.then((result) => {
      console.log('Closed with: ${result}');
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }

  downloadFile():void{
    this.modalService.open(DownloadRemainingVoucherDetailsComponent).result.then((result) => {
      console.log('Closed with: ${result}');
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }

}
