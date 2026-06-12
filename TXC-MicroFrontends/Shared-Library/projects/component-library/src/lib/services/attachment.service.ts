import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as saveAs from 'file-saver';
import { CustomFile } from '../models/custom-file.model';


@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  constructor(private http: HttpClient) {}

  downloadRecentlyUploadedAttachment(attachment: CustomFile) {
    const fileBlob = new Blob([attachment], { type: attachment.type });
    saveAs(fileBlob, attachment.name);
  }

  downloadSample(event: Event, href: string) {
    event.stopPropagation();
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = href;
    link.download = 'Inventory file template.xlsx';
    document.body.appendChild(link);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    link.remove();
  }
}
