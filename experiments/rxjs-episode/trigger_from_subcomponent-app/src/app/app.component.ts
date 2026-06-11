import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ModalSubscriberService } from './modal.subscriber.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'template-app';
  private ngUnsubscribe = new Subject<void>();
  @ViewChild('personalInfoModal', { static: true }) personalInfoModal: ElementRef = {} as ElementRef;
  @ViewChild('blockUnblockModal', { static: true }) blockUnblockModal: ElementRef = {} as ElementRef;
  @ViewChild('editHistoryModal', { static: true }) editHistoryModal: ElementRef = {} as ElementRef;

  constructor(private readonly modalSubscriberSvc: ModalSubscriberService, private readonly modalSvc: NgbModal){
    
  }

  ngOnInit(): void {
    this.subscribeToModal();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  private subscribeToModal() {
    this.modalSubscriberSvc.currentState.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        if (res == null) {
          return;
        }
        if (res["modalName"] == 'personalInfo') {
          this.openPersonalInfoModal(this.personalInfoModal, res);
          this.modalSubscriberSvc.changeState(null);
        } else if (res["modalName"] == 'blockUnblock') {
          this.openBlockUnblockModal(this.blockUnblockModal, res);
          this.modalSubscriberSvc.changeState(null);
        } else if (res["modalName"] == 'editHistory') {
          this.openEditHistoryModal(this.editHistoryModal, res);
          this.modalSubscriberSvc.changeState(null);
        }
      }
    });
  }

  openPersonalInfoModal(content: ElementRef, user: any) {
    this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openBlockUnblockModal(content: ElementRef, user: any) {
    this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }  

  openEditHistoryModal(content: ElementRef, user: any) {
    this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

}
