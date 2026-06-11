import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { ProductWizardRequest, ProductTemplate } from '../models/product-wizard-dto.model';
import { TextEditorService } from './text-editor.service';

@Injectable({
  providedIn: 'root'
})
export class ProductWizardService {
  public loading$ = new BehaviorSubject<boolean>(false);

  get isLoading$() { return this.loading$.asObservable(); }

  constructor(private readonly http: HttpClient, private readonly _textEditorService: TextEditorService) { }

  initializeProductWizard(body: {productType: number, productId: number}, showLoadingIndicator: boolean = false) {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard`;
    const headers = new HttpHeaders().append('loading-indicator', showLoadingIndicator ? 'on' : 'none');
    return this.http.post(url, { productType: body.productType, productId: body.productId }, { headers }) as Observable<BaseResponse>;
  }

  getProductWizard(wizardKey: string, showLoadingIndicator: boolean = false) {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard/Detail?WizardKey=${wizardKey}`;
    const headers = new HttpHeaders().append('loading-indicator', showLoadingIndicator ? 'on' : 'none');
    return this.http.get(url, { headers }) as Observable<BaseResponse>;
  }

  updateProductWizard(key: string, step: number, values: any, showLoadingIndicator: boolean = false) {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard`;
    let body: ProductWizardRequest = new ProductWizardRequest(key, step, values, this._textEditorService);

    if (step === 4 && body.productWizardDto.productWizardStepFour?.productTemplateList) {
      body.productWizardDto.productWizardStepFour.productTemplateList = values.updatedProductTemplateList;
    }

    const headers = new HttpHeaders().append('loading-indicator', showLoadingIndicator ? 'on' : 'none');
    return this.http.put(url,  body, { headers }) as Observable<BaseResponse>;
  }

  createProductWizard(key: string, showLoadingIndicator: boolean = false) {
    const url = `https://${environment.apiUrl}api/Product/Product`;
    const headers = new HttpHeaders().append('loading-indicator', showLoadingIndicator ? 'on' : 'none');
    return this.http.post(url,  {wizardKey: key}, { headers }) as Observable<BaseResponse>;
  }
}
