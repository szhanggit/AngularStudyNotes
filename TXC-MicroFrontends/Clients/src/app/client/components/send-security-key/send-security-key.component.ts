import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-send-security-key',
  templateUrl: './send-security-key.component.html',
  styleUrls: ['./send-security-key.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SendSecurityKeyComponent implements OnInit {

  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @Input() clientId!: number;
  @Input() securityKey!: string;
  @Input() clientEmailList!: any;
  clientContact: string = "";
  maskedSecurityKey!: string;
  selectedTenant!: number;

  constructor(private modalService: NgbModal,
    private clientService: ClientService) { }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).id;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.securityKey) {
      this.maskedSecurityKey = this.securityKey.slice(-3).padStart(this.securityKey.length, '*');
    }
  }

  confirmEmailAction(modalCancelConfrimation: any): void {
    if (this.securityKey || this.clientId) {
      this.modalService.open(modalCancelConfrimation,
        { backdrop: 'static', keyboard: false, centered: true, windowClass: 'send-security-key-modal' }
      );
    } else {
      this.toast.showDanger('Security key or client id is missing. Please try again...')
    }
  }

  sendSecurityKey() {
    let requestBody = {
      clientId: this.clientId,
      clientContactId: parseInt(this.clientContact),
    }
    this.clientService.sendSecurityKey(requestBody).subscribe(res => {
      if (res.success) {
        this.toast.showSuccess('Security key sent successfully.');
        this.clientContact = '';
      } else {
        this.toast.showDanger('Unable to send security key. Please try again.');
      }
    }, (e) =>{
      let errorMessage = (e.error.data) ? e.error.data.join(' ,') : e.error.message;
      this.toast.showDanger(errorMessage);
    })
  }
}
