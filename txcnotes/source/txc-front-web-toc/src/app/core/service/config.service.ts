import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigModel } from '../models/common/config-model';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  currentUrl:BehaviorSubject<string> = new BehaviorSubject<string>("");
  config:ConfigModel;  
  constructor(private readonly httpClient:HttpClient) { 
  
  }
  

  get() {    
    // let splited = window.location.toString().split('\/');
    // environment
    // let configUrl = splited[0] + "//" + splited[2] + environment.apiUrl; //"/WebToc/assets/config.json";
    // console.log(configUrl);

    // const subscriber = this.httpClient.get(configUrl).subscribe({
    //   next: res=> {
    //     this.config = res as ConfigModel;
    //     this.currentUrl.next(this.config.apiUrl.tenant);
    //   },
    //   error: e=> {
    //     console.log(e);
    //     subscriber.unsubscribe();
    //   }, complete:()=>{
    //     subscriber.unsubscribe();
    //   }
    // })
  }
}
