import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttachmentService, Button, ConfirmationModalComponent, ErrorMessage } from '@txc-angular/component-library';
import { UploadBatchComponent } from './upload-batch/upload-batch.component';
import { environment } from 'src/environments/environment';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { UtilityService } from '../../services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch-error',
  templateUrl: './batch-error.component.html',
  styleUrls: ['./batch-error.component.scss']
})
export class BatchErrorComponent implements OnInit {
  @Input() status!: string;
  @Input() title: string = '';
  @Input() reuploadTitle: string = '';
  @Output() selectedViewChange = new EventEmitter<string>();

  limit: number = 20;
  errorMessages: ErrorMessage[] = [];
  actionButtons: Button[] = [
    {
      buttonText: 'Cancel Batch',
      buttonClass: 'btn-secondary',
      isDropdown: true,
      buttonAction: () => this.onCancel(),
    },
    {
      buttonText: 'Download ',
      buttonClass: 'btn-secondary',
      buttonAction: ($event) => this.onDownload($event),
    },
    {
      buttonText: 'Reupload',
      buttonClass: 'btn-primary',
      buttonAction: () => this.onReupload(),
    }
  ];

  constructor(
      private modalSvc: NgbModal,
      private attachmentService: AttachmentService,
      private utilitySvc: UtilityService,
      private batchListStateService: BatchListStateService,
      private router: Router,
    ){}

  ngOnInit(){
    this.getErrorType();
    this.batchListStateService.selectedItem$
      .subscribe(item => 
        this.errorMessages = 
          this.utilitySvc.transformErrors(
            item.errorReason!.details
          )
      );
  }

  getRedirectionUrl(): string {
    const fullPath = this.router.url;
    const baseUrl = fullPath.split('?')[0];

    return baseUrl;
  }

  getErrorType(){
    if (this.status == 'Failed') {
      this.actionButtons = [...this.actionButtons.filter(button => button.buttonText.trim() === 'Download')];
      this.actionButtons[0].buttonClass = 'btn-primary';
    }
  }

  onCancel(){
    const modalRef = this.modalSvc.open(
      ConfirmationModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
    modalRef.componentInstance.title = 'Cancel batch';
    modalRef.componentInstance.description =
      'Are you sure you want to cancel batch? Your imported file will be removed once it\'s canceled.';
      modalRef.componentInstance.firstButton = {
        buttonText: 'Keep batch',
        buttonClass: 'btn-secondary',
      };
      modalRef.componentInstance.secondButton = {
        buttonText: 'Cancel batch',
        buttonClass: 'btn-primary',
      };
    modalRef.result.then((res: string) => {
      if (res === 'confirm') {
        //TODO: change batch status to cancel on API integration
        this.selectedViewChange.emit('');
        this.router.navigateByUrl(this.getRedirectionUrl());
      }
    });
  }

  onDownload(event: Event) {
    // TODO: change to actual file on API integration
    const href = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';
    this.attachmentService.downloadSample(event, href);
  }
  

  onReupload(){
    const modalRef = this.modalSvc.open(UploadBatchComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.title = this.reuploadTitle;

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          //TODO: change batch status to initializing on API integration
          this.selectedViewChange.emit('');
          this.router.navigateByUrl(this.getRedirectionUrl());
        }
      })
      .catch((error) => {
        // add logic for error handling if necessery
      });
  }
}
