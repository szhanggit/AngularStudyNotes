import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ALPageState, ShopOption } from '../models/acceptance-loop.model';

@Injectable({
    providedIn: 'root'
  })
export class AcceptanceLoopService {
    constructor() {}

    private _shopOptions$ = new BehaviorSubject<ShopOption[]>([]);
    private _totalSelected$ = new BehaviorSubject<number>(0);
    private _totalUnselected$ = new BehaviorSubject<number>(0);
    private _pageState: ALPageState = {
      pageSize: 10,
      pageSelected: 1,
      pageUnselected: 1
    }

    get shopOptions$() { return this._shopOptions$.asObservable(); }
    get totalSelected$() { return this._totalSelected$.asObservable(); }
    get totalUnselected$() { return this._totalUnselected$.asObservable(); }
    get pageSize() { return this._pageState.pageSize; }
    get pageSelected() { return this._pageState.pageSelected; }
    get pageUnselected() { return this._pageState.pageUnselected; }

    set pageSelected(page: number) { this._pageState.pageSelected = page; }
    set pageUnselected(page: number) { this._pageState.pageUnselected = page; }

    refreshShopOptions(shopOptions: ShopOption[]) {
      this._shopOptions$.next(shopOptions);

      const selectedAmount = shopOptions.filter(x => x.isSelected).length;
      this._totalSelected$.next(selectedAmount);
      this._totalUnselected$.next(shopOptions.length - selectedAmount);

      this.initPage();
    }

     initPage() {
      this.pageSelected = 1;
      this.pageUnselected = 1;
    }
   
}

