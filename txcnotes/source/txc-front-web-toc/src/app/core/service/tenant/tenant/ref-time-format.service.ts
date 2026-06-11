import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefTimeFormatModel } from 'src/app/core/models/tenant/ref-time-format-model';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefTimeFormatService {

  private controller: string = "Tnt/RefTimeFormat";
  constructor(private apiSvc:ApiService) { }

  getRefTimeFormats():Observable<RefTimeFormatModel[]>{
    return this.apiSvc.get(this.controller);
  }
}
