import { Component, OnInit, inject, TemplateRef, Input } from '@angular/core';
import { NgbActiveModal, ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from '../Model/merchant';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})
export class ModalContentComponent implements OnInit {
  @Input()
  public merchant :Merchant = new Merchant(0, '');

  constructor(public activeModal: NgbActiveModal) { 

  }

  ngOnInit(): void {
  }

  close() {
    //this.activeModal.close('Close click');
    this.activeModal.close({merchant: this.merchant, a1: 'Hello', a2: 'World', a3: '!'});
  }
}
