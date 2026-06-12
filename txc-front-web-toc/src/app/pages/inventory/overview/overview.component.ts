import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportVoucherNoComponent } from './model/import-voucher-no/import-voucher-no.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openImportVoucherNumberModel():void{
    this.modalService.open(ImportVoucherNoComponent).result.then((result) => {
      console.log('Closed with: ${result}');
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }
}
