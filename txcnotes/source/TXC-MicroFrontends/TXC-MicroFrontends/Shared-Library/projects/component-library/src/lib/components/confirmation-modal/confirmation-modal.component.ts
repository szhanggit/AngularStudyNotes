import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Button } from '../../models/button.model';

@Component({
  selector: 'lib-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() title!: string;
  @Input() description!: string;
  @Input() firstButton!: Button;
  @Input() secondButton!: Button;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
