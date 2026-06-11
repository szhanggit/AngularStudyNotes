import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudModel } from 'src/app/core/models/common/crud-model';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  crudModel = new BehaviorSubject<CrudModel>(new CrudModel());
  constructor() { }

  observer = this.crudModel.asObservable();
}
