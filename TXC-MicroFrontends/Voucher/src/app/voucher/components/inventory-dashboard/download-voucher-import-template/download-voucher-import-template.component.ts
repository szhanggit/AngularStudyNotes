import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-download-voucher-import-template',
  templateUrl: './download-voucher-import-template.component.html',
  styleUrls: ['./download-voucher-import-template.component.scss']
})
export class DownloadVoucherImportTemplateComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  options = [
    {templateid: 1, templatename: "template 1"},
    {templateid: 2, templatename: "template 2"},
    {templateid: 3, templatename: "template 3"}
  ];
 
}

