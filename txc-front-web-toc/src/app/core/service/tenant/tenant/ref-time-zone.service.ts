import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefTimeZoneModel } from 'src/app/core/models/tenant/ref-time-zone-model';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefTimeZoneService {

  private controllter: string = "Tnt/RefTimeZone";
  constructor(private readonly apiSvc:ApiService) { }

  public getRefTimeZones(): Observable<RefTimeZoneModel[]>{
    return this.apiSvc.get(this.controllter);
  }
}
