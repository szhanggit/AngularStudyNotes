import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, takeUntil } from 'rxjs';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ExpirationPolicy } from 'src/app/products/models/expiry-scheme.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FlexibleExpiryModalSetup, FlexibleExpiryModalResponse } from 'src/app/products/models/expiry-scheme-fixed-flexible.model';

@Component({
  selector: 'app-expiry-scheme-flexible',
  templateUrl: './expiry-scheme-flexible.component.html',
  styleUrls: ['./expiry-scheme-flexible.component.scss']
})
export class ExpirySchemeFlexibleComponent implements OnInit, OnDestroy {
  @Input() modalSetup!: FlexibleExpiryModalSetup;

  readonly DEFAULT_SELECTED_TYPE = ExpirationPolicyTypeEnum.All;
  readonly EXPIRY_FILTER_DEBOUNCE_TIME = 200;

  ExpirationPolicyTypeEnum = ExpirationPolicyTypeEnum;

  filter$ = new BehaviorSubject(this.DEFAULT_SELECTED_TYPE);
  expirySchemeFlexibleTypeFilter: ExpirationPolicyTypeEnum[] = [];;
  toggleCheckboxStatus = false;
  toggleCheckboxStatus$ = new BehaviorSubject<boolean>(false);

  destroy$ = new Subject();

  // full list of flexible schemes (EdenredFlexable or ThirdPartyFlexable)
  get expirySchemeList(): ExpirationPolicy[] {
    return this.modalSetup.expirySchemeList;
  }
  get selectedExpiryCount(): number {
    return this.expirySchemeList?.filter(x => x.checked)?.length ?? 0;
  }

  private _selectedTypeFilter: ExpirationPolicyTypeEnum = this.DEFAULT_SELECTED_TYPE;
  public get selectedTypeFilter(): ExpirationPolicyTypeEnum {
    return this._selectedTypeFilter;
  }
  public set selectedTypeFilter(v: ExpirationPolicyTypeEnum) {
    this._selectedTypeFilter = v;
    this.filter$.next(v);
  }

  constructor(
    private readonly ngbActiveModel: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.setTypeFilter();
    this.setToggleCheckboxSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.filter$.complete();
    this.toggleCheckboxStatus$.complete();
  }

  onConfirm() {
    this.ngbActiveModel.close({
      expirySchemeList: this.expirySchemeList,
      isFixedExpiryPolicy: false,
    } as FlexibleExpiryModalResponse);
  }

  onCancel() {
    this.ngbActiveModel.dismiss();
  }

  toggleCheckboxes(checked: boolean): void {
    this.expirySchemeList?.forEach(x => {
      x.checked = x.displayed ? checked : x.checked;
    });
  }

  toggleCheckbox(checked: boolean) {
    if (!checked) {
      this.toggleCheckboxStatus$.next(false);
    }
    else {
      this.refreshToggleCheckboxStatus();
    }
  }

  private refreshToggleCheckboxStatus() {
    let displayedCnt = 0;
    let displayedCheckedCnt = 0;

    this.expirySchemeList?.forEach(e => {
      displayedCnt += e.displayed ? 1 : 0;
      displayedCheckedCnt += e.displayed && e.checked ? 1 : 0;
    });

    this.toggleCheckboxStatus$.next(displayedCnt === displayedCheckedCnt);
  }

  private setToggleCheckboxSubscriptions() {
    this.toggleCheckboxStatus$.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.toggleCheckboxStatus = x;
      });
  }

  private setTypeFilter() {
    this.expirySchemeFlexibleTypeFilter = [...new Set(
      this.expirySchemeList?.map(x => x.type)
    )];

    this.filter$.asObservable()
      .pipe(
        debounceTime(this.EXPIRY_FILTER_DEBOUNCE_TIME),
        takeUntil(this.destroy$)
      ).subscribe(x => {
        this.expirySchemeList?.forEach(e => {
          e.displayed = x == this.DEFAULT_SELECTED_TYPE ? true : e.type == x;
        });
        this.refreshToggleCheckboxStatus();
      });
  }
}
