import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-batch-detail',
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.scss']
})
export class BatchDetailComponent implements OnInit {

  batch_detail_list : any[] = [];

  constructor(
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onReject(): void{
  }

  downloadFile():void{
  }

}
