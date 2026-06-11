import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GetImageListResponseModel } from 'src/app/core/models/media/get-image-list-response-model';
import { GetMediaListQueryModel } from 'src/app/core/models/media/get-media-list-query-model';
import { ApiService } from '../api.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private controller = 'Media';
  constructor(private readonly configSvc:ConfigService
    , private apiSvc: ApiService
    , private toastr:ToastrService) {
    // this.configSvc.currentUrl.next(this.configSvc.config.apiUrl.media);
  }

  updateFileName(data:any, callbackFn:any){
    const subscriber = this.apiSvc.put(this.controller,data)
    .subscribe({
      next:res=>{
        
        callbackFn(res);
      }, error: e=>{
        this.toastr.error("Failed to update the filename", "Error");
        console.log(e);
        subscriber.unsubscribe();
      },
      complete: ()=>{
        subscriber.unsubscribe();
      }
    })
  }

  getImages(parameter:GetMediaListQueryModel,callbackFun:any){

    let param = "?";
    const p = parameter as any;
    const keys = Object.keys(p);
    keys.forEach((fe,i)=>
    {  
      if(i < keys.length -1){
        param += `${fe}=${p[fe]}&`;
      } else{
        param += `${fe}=${p[fe]}`;
      }
      
    });

      this.apiSvc.get(this.controller + param)
      .subscribe({
        next: res =>{
          callbackFun(res);
        }
      })
  }

}
