import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetImageListResponseModel } from 'src/app/core/models/media/get-image-list-response-model';
import { ApiService } from '../api.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private controller = 'ImageMediaBlob';
  constructor(private readonly configSvc:ConfigService
    , private apiSvc: ApiService) {
    // this.configSvc.currentUrl.next(this.configSvc.config.apiUrl.media);
  }

  
 uploadImage(data:FormData){
  return this.apiSvc.uploadFile(this.controller,data);
 }

 replaceImage(data:FormData){
   return this.apiSvc.replaceFile(this.controller,data);
 }

}
