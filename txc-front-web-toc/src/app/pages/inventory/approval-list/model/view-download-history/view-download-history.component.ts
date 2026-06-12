import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-download-history',
  templateUrl: './view-download-history.component.html',
  styleUrls: ['./view-download-history.component.scss']
})
export class ViewDownloadHistoryComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
