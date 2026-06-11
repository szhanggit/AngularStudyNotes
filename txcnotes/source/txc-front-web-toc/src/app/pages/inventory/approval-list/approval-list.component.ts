import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadRemainingVoucherDetailsComponent } from '../../merchant-sku/detail/model/download-remaining-voucher-details/download-remaining-voucher-details.component';
import { InventoryService } from '../services/inventory.service';
import { ViewDownloadHistoryComponent } from './model/view-download-history/view-download-history.component';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit {
 
  @ViewChild('accessdenied', { read: TemplateRef }) accessdeniedModel:TemplateRef<any>;

  approval_list : any[] = [];

  currentUserName : string = JSON.parse(sessionStorage.getItem('currentUser')).name;

  constructor(private inventoryService : InventoryService,
     private modalService: NgbModal, 
     private router : Router) { }

  ngOnInit(): void {
    this.inventoryService.Approval_List().subscribe({next:(response:any) => {                           //next() callback
        console.log('response received', response);
        this.approval_list = response;
      },
      error :
      (error) => {                              //error() callback
        debugger;
        console.error('Request failed with error',error)
      }
    });
  }

  onRowClick(item : any){
    console.log(sessionStorage.getItem('currentUser'));
    if(item.creator == this.currentUserName){
      this.router.navigate(['/inventory/batch-detail']);
    }
    else{
      this.modalService.open(this.accessdeniedModel, {ariaLabelledBy: 'modal-basic-title'});
    }
  }

  downloadFile():void{
    this.modalService.open(DownloadRemainingVoucherDetailsComponent).result.then((result) => {
      console.log('Closed with: ${result}');
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }

  viewDownloadHistory(){
    this.modalService.open(ViewDownloadHistoryComponent, {scrollable:true,size:'xl'}).result.then((result) => {
      console.log('Closed with: ${result}');
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }

}
