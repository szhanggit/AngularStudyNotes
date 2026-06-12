import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-voucher-import-file',
  templateUrl: './upload-voucher-import-file.component.html',
  styleUrls: ['./upload-voucher-import-file.component.scss']
})
export class UploadVoucherImportFileComponent implements OnInit {

  files: File[] = [];

	onSelect(event: any) {
		this.files.push(...event.addedFiles);
	}

	onRemove(event:any) {
		this.files.splice(this.files.indexOf(event), 1);
	}

  constructor(public activeModal: NgbActiveModal,
    private router : Router) { }

  ngOnInit(): void {
  }

  import():void{
    this.activeModal.close('Close click');
  }

}
