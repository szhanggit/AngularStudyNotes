import { Component, inject, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { Merchant } from './Model/merchant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'template-app';

  constructor(private modalService: NgbModal) {}

  openModal() {
    let merchant :Merchant = new Merchant(1000, 'Milk Box'); 
    const options: NgbModalOptions = {
      backdropClass: '.app-session-modal-backdrop',
      windowClass: '.app-session-modal-window',
      animation: true, centered: true, keyboard: true, size: 'xl'
    };
    const modalRef = this.modalService.open(ModalContentComponent, options);
    modalRef.componentInstance.merchant = merchant;
    modalRef.result.then((result) => {
      console.log('Closed with: ', result);
      //this.disableSearch = true;
      //this.shopSelectedList = result.selected;
      //this.shopUnselectedList = result.unselected;
    }, (reason) => {
      console.log("Dismissed ${this.getDismissReason(reason)}");
    });
  }

  letUsSubmit(content : any){
      this.modalService.open(content,{size : 'sm'}).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });;
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
