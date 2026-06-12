import { Injectable } from '@angular/core';
import { RefCountryModel } from 'src/app/core/models/tenant/ref-country-model';
import { RefLanguageModel } from 'src/app/core/models/tenant/ref-language-model';
import { RefTimeFormatModel } from 'src/app/core/models/tenant/ref-time-format-model';
import { RefTimeZoneModel } from 'src/app/core/models/tenant/ref-time-zone-model';
import { RefCountryService } from './ref-country.service';
import { RefLanguageService } from './ref-language.service';
import { RefTimeFormatService } from './ref-time-format.service';
import { RefTimeZoneService } from './ref-time-zone.service';

@Injectable({
  providedIn: 'root'
})
export class TenantReferencesService {
  countries: RefCountryModel[];
  timeZones: RefTimeZoneModel[];
  timeFormats: RefTimeFormatModel[];
  languages: RefLanguageModel[];
  private services =[
    { 
      observable: this.refCountrySvc.getRefCountries(), command: (d: any[])=>{
        this.countries = d as RefCountryModel[];
      }
    },
    { 
      observable: this.refTimeZoneSvc.getRefTimeZones(), command: (d: any[]) =>{
        this.timeZones = d as RefTimeZoneModel[];
      }
    },
    {
      observable: this.refTimeFormatSvc.getRefTimeFormats(), command: (d: any[])=>{
        this.timeFormats = d as RefTimeFormatModel[];
      }
    },
    {
      observable: this.refLanguageSvc.getRefLanguages(), command: (d: any[])=>{
        this.languages = d as RefLanguageModel[];
      }
    }    
  ];

  constructor(private readonly refCountrySvc:RefCountryService
    , private readonly refLanguageSvc:RefLanguageService
    , private readonly refTimeFormatSvc:RefTimeFormatService
    , private readonly refTimeZoneSvc: RefTimeZoneService) { }

    initializeReferences(){
      this.services.forEach((fe,i)=>{
        const subscriber = fe.observable.subscribe({
          next: res=>{
            fe.command(res);
          }, error: e=>{
            console.log(e);
            subscriber.unsubscribe();
          }, complete: ()=>{
            subscriber.unsubscribe();
          }
        });    
      });
    }
}
