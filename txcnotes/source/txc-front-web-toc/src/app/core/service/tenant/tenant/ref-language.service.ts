import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefLanguageModel } from 'src/app/core/models/tenant/ref-language-model';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefLanguageService {

  private controller: string = "Tnt/RefLanguage";
  constructor(private apiSvc: ApiService) { }

  getRefLanguages():Observable<RefLanguageModel[]>{
    return this.apiSvc.get(this.controller);
  }
}
