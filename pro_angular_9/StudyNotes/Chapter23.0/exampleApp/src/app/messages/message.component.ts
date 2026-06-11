import { Component } from "@angular/core";
import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { Observable } from "rxjs";

@Component({
    selector: "paMessages",
    templateUrl: "message.component.html",
})
export class MessageComponent {
    lastMessage: Message;

    constructor(messageService: MessageService) {
        messageService.registerMessageHandler(m => this.lastMessage = m);
        //messageService.messages.subscribe(m => this.lastMessage = m);
    }
}
