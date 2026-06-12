import { Component, OnInit } from '@angular/core';
import { DownloadVoucherImportTemplateComponent } from '../download-voucher-import-template/download-voucher-import-template/download-voucher-import-template.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadVoucherImportFileComponent } from '../upload-voucher-import-file/upload-voucher-import-file.component';

@Component({
  selector: 'app-import-voucher-no',
  templateUrl: './import-voucher-no.component.html',
  styleUrls: ['./import-voucher-no.component.scss']
})
export class ImportVoucherNoComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openDownloadVoucherImportTemplateModel():void{
    this.activeModal.dismiss('Cross click');
    this.modalService.open(DownloadVoucherImportTemplateComponent).result.then((result) => {
      console.log('Closed with: ${result}');
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }
  
  openUploadVoucherImportFileModel(){
      this.activeModal.dismiss('Cross click');
      this.modalService.open(UploadVoucherImportFileComponent).result.then((result) => {
        console.log('Closed with: ${result}');
      }, (reason) => {
        console.log("Dismissed ${this.getDismissReason(reason)}");
      });
  }
}
