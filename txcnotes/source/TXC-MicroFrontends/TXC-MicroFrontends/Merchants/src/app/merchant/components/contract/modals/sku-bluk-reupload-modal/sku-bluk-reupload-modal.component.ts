import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sku-bluk-reupload-modal',
  templateUrl: './sku-bluk-reupload-modal.component.html',
  styleUrls: ['./sku-bluk-reupload-modal.component.scss']
})
export class SkuBlukReuploadModalComponent implements OnInit {

  @Input() programId!: number;
  @Input() merchantId!: number;
  @Input() costSchemeId!:string;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
