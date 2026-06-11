import { Injectable } from '@angular/core';
import { DeliveryDetail } from '../models/delivery-details.model';
import { DirectDeliveryDetailsList } from '../models/direct-delivery-details.model';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { BaseState } from '../models/order-state.model';

const MOCK_DELIVERY_DETAILS: DeliveryDetail[] = [{
  beneficiaryName: 'Raymark Pedroza',
  contactInfoEmailAddress: 'pedroza.raymark@consulting-for.edenred.com',
  voucherQuantity: 10,
  faceValue: 1000,
  address: 'PH',
  language: '',
  postCode: '1XXX',
  edOrderNumber: '',
  postCodeAddress: ''
}, {
  beneficiaryName: 'Olga Andriychenko',
  contactInfoEmailAddress: 'andriychenko.olga@consulting-for.edenred.com',
  contactInfoPhoneNumber: '0000000000',
  voucherQuantity: 20,
  faceValue: 2000,
  address: 'TW',
  language: '',
  postCode: '2XXX',
  edOrderNumber: '',
  postCodeAddress: '',
}, {
  beneficiaryName: 'Bryantt Feliciano',
  contactInfoPhoneNumber: '0000000001',
  voucherQuantity: 5,
  faceValue: 3000,
  address: 'PH',
  language: '',
  postCode: '3XXX',
  edOrderNumber: '',
  postCodeAddress: ''
}];

const MOCK_DELIVERY_DETAILS_LIST: DirectDeliveryDetailsList[] = [
  {
    email: 'pedroza.raymark@example.com',
    sms: '0912345678',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'andriychenko.olga@example.com',
    sms: '',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'feliciano.bryantt@example.com',
    sms: '0912345679',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'singh.vipin@example.com',
    sms: '0912345680',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'kao.annie@example.com',
    sms: '',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'huang.miller@example.com',
    sms: '0915345678',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'alcabasa.lean@example.com',
    sms: '0917345678',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'gamboa.ronald@example.com',
    sms: '',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'blanco.ruby@example.com',
    sms: '',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  },
  {
    email: 'rong.katie@example.com',
    sms: '',
    activeDate: '2023/05/01 12:45:48',
    expiryDateType: 'Fix End of Day',
    expiryDate: '2023/05/01 23:59:59',
  }
];


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _deliveryDetailsList$ = 
    new BehaviorSubject<DirectDeliveryDetailsList[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: BaseState = {
    page: 0,
    pageSize: 20,
    searchTerm: ''
  };


  get deliveryDetailsList$() {
    return this._deliveryDetailsList$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this.set({ page });
  }
  set pageSize(pageSize: number) {
    this.set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this.set({ searchTerm: searchTerm });
  }

  private set(patch: Partial<BaseState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  constructor() {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this.getDeliveryDetailsList()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((res: DirectDeliveryDetailsList[]) => {
        if (res && res.length > 0) {
          this._deliveryDetailsList$.next(res);
          this._total$.next(res.length);
        } else {
          this._deliveryDetailsList$.next([]);
          this._total$.next(0);
        }
      });

      this._search$.next();
  }

  getDeliveryDetails(): DeliveryDetail[] {
    return [...MOCK_DELIVERY_DETAILS];
  }

  getDeliveryDetailsList(): Observable<DirectDeliveryDetailsList[]> {
    const {
      page,
      pageSize,
      searchTerm
    } = this._state;

    const results: DirectDeliveryDetailsList[] = 
      MOCK_DELIVERY_DETAILS_LIST.filter(
        item => 
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.sms.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(results);
  }
}
