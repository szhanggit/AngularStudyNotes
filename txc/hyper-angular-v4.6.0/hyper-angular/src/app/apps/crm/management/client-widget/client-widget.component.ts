import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// types
import { ChatMessage } from 'src/app/shared/widget/chat/chat.model';
import { Client } from '../../shared/crm.model';

// data
import { chatMessages } from 'src/app/shared/widget/chat/data';


@Component({
  selector: 'app-management-clients',
  templateUrl: './client-widget.component.html',
  styleUrls: ['./client-widget.component.scss']
})
export class ClientWidgetComponent implements OnInit {

  @Input() clients: Client[] = [];
  chatMessages: ChatMessage[] = [];
  currentClient: Client = this.clients[0];

  constructor (private modalService: NgbModal) { }

  ngOnInit(): void {
    this._fetchData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.chatMessages = chatMessages;
  }

  /**
 * opens new project modal
 * @param content modal ref
 */
  open(content: TemplateRef<NgbModal>, client: Client) {
    this.currentClient = client;
    this.modalService.open(content, { centered: true })
  }


}
