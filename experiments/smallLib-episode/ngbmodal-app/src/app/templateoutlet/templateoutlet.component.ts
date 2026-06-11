import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-templateoutlet',
  templateUrl: './templateoutlet.component.html',
  styleUrls: ['./templateoutlet.component.css']
})
export class TemplateoutletComponent implements OnInit {
  
  @ViewChild('personalInfoModal', { static: true }) 
  personalInfoModal: ElementRef = {} as ElementRef;

  // modal config
  modalModel!: any;
  constructor(private readonly modalSvc: NgbModal) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modalModel = {
      name: "Steven",
      userName: "szhang",
      email: "steven.zhang-extern@renault.com",
      tenant: "Renault",
      application: "Renault Report App"
    }
    this.modalSvc.open(this.personalInfoModal, { ariaLabelledBy: 'modal-basic-title' });
  }

}
