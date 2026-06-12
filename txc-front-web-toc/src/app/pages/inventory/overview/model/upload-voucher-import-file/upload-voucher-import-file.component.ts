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
		console.log(event);
		this.files.push(...event.addedFiles);
	}

	onRemove(event:any) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}

  constructor(public activeModal: NgbActiveModal,
    private router : Router) { }

  ngOnInit(): void {
  }

  import():void{
    this.activeModal.close('Close click');
    this.router.navigate(['/inventory/set-cost-merchant-sku']);
  }

}
