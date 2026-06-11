import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { CustomFile } from 'src/app/shared/models/custom-file.model';
import * as saveAs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  constructor(private http: HttpClient) {}

  private _getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getOrderAttachments(orderId: number) {
    const url = `${this._getURL()}api/Order/GetOrderAttachments/${orderId}`;

    return (this.http.get(url) as Observable<BaseResponse>).pipe(
      map((res) => res.data.attachmentsInfo)
    );
  }

  editFileAttachment(
    orderId: number,
    files: CustomFile[]
  ): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Order/EditFileAttachment`;
    const formData = new FormData();
    formData.append('OrderId', orderId.toString());
    files.forEach((file) => {
      formData.append('Attachments', file, file.name);
    });

    return this.http.post(url, formData) as Observable<BaseResponse>;
  }

  downloadOrderAttachment(fileName: string, orderId: number) {
    const url = `${this._getURL()}api/Order/DownloadOrderAttachment`;
    const body = {
      fileName: fileName,
      orderId: orderId,
    };

    return this.http.post(url, body, {
      responseType: 'blob',
    });
  }

  deleteFileAttachment(
    orderId: number,
    dateRequested: string,
    fileNames: string[]
  ) {
    const url = `${this._getURL()}api/Order/DeleteFileAttachment`;
    const body = {
      orderId: orderId,
      dateRequested: dateRequested,
      fileName: fileNames,
    };

    return this.http.delete(url, { body: body }) as Observable<BaseResponse>;
  }

  downloadRecentlyUploadedAttachment(attachment: CustomFile) {
    const fileBlob = new Blob([attachment], { type: attachment.type });
    saveAs(fileBlob, attachment.name);
  }
}
