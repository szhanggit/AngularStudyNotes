import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProductVoucherGeneratorEnum } from 'src/app/products/enums/voucher-generator.enum';
import { ExpirySchemeFixedComponent } from './expiry-scheme-fixed/expiry-scheme-fixed.component';
import { ExpirationPolicy } from 'src/app/products/models/expiry-scheme.model';
import { ExpirySchemeFlexibleComponent } from './expiry-scheme-flexible/expiry-scheme-flexible.component';
import { ProductVoucherGeneratorService } from 'src/app/products/services/product-voucher-generator.service';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { FixedFlexibleComponentSetup, FixedFlexibleComponentEvent, FixedExpiryModalResponse, FixedExpiryModalSetup, FlexibleExpiryModalResponse, FlexibleExpiryModalSetup } from 'src/app/products/models/expiry-scheme-fixed-flexible.model';

@Component({
  selector: 'app-expiry-scheme-fixed-flexible',
  templateUrl: './expiry-scheme-fixed-flexible.component.html',
  styleUrls: ['./expiry-scheme-fixed-flexible.component.scss']
})
export class ExpirySchemeFixedFlexibleComponent implements OnInit, OnDestroy {
  @Input() componentSetup!: FixedFlexibleComponentSetup;
  @Output() selectionChange = new EventEmitter<FixedFlexibleComponentEvent>();
  @Output() errorThrown = new EventEmitter<Error>();

  // error message
  readonly FIX_END_OF_DAY_ID_NOT_FOUND = 'Error getting ID of expiry scheme "FixEndOfDay"';
  readonly MORE_THAN_ONE_SELECTED = 'More than one fixed expiry selected';
  readonly MIXED_CATEGORIES_SELECTED = 'Flexible and fixed expiries are selected at the same time. Please update data.'

  ExpirationPolicyTypeEnum = ExpirationPolicyTypeEnum;

  fixEndOfDayId?: number;
  expirySchemeListMap = new Map<ProductVoucherGeneratorEnum, ExpirationPolicy[]>();
  selectedExpirySchemes$ = new BehaviorSubject<ExpirationPolicy[]>([]);
  selectedExpirySchemes: ExpirationPolicy[] = [];
  isModified: boolean = false;
  isItemErrorToasted: boolean = false;
  isSelectionCatogoryErrorHandled: boolean = false;

  destroy$ = new Subject();

  get KEYWORD_FIX_END_OF_DAY(): string {
    return this.productVoucherGeneratorService.KEYWORD_FIX_END_OF_DAY;
  }
  get fixedGeneratorEnum(): ProductVoucherGeneratorEnum {
    return this.isEdenredProgram
      ? ProductVoucherGeneratorEnum.EdenredFixed
      : ProductVoucherGeneratorEnum.ThirdPartyFixed;
  }
  get flexibleGeneratorEnum(): ProductVoucherGeneratorEnum {
    return this.isEdenredProgram
      ? ProductVoucherGeneratorEnum.EdenredFlexable
      : ProductVoucherGeneratorEnum.ThirdPartyFlexable;
  }
  get isEdenredProgram(): boolean {
    return this.componentSetup.isEdenredProgram;
  }
  // full list of expiry schemes (both fixed and flexible)
  get expirySchemeList(): ExpirationPolicy[] {
    return this.componentSetup.expirySchemeList;
  }
  get selectedSchemeIds(): number[] {
    return this.componentSetup.selectedSchemeIds;
  }
  get todayDate(): Date {
    return this.componentSetup.todayDate;
  }
  get isFixedExpiryPolicy() : boolean {
    return this.componentSetup.isFixedExpiryPolicy;
  }
  set isFixedExpiryPolicy(isFixed: boolean) {
    this.componentSetup.isFixedExpiryPolicy = isFixed;
  }
  get productExpiryDate(): Date | undefined {
    return this.componentSetup.productExpiryDate;
  }
  set productExpiryDate(date: Date | undefined) {
    this.componentSetup.productExpiryDate = date;
  }

  constructor(
    private readonly productVoucherGeneratorService: ProductVoucherGeneratorService,
    private readonly ngbModal: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.setFixEndOfDayId();
    this.setExpirySchemeListMap();
    this.setSubscriptionsForSelectedExpiry();
    this.setSelectedExiprySchemesByIds(this.selectedSchemeIds);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.selectedExpirySchemes$.complete();
    this.selectionChange.complete();
    this.errorThrown.complete();
  }

  openFixedModal(): void {
    const modalRef = this.ngbModal.open(
      ExpirySchemeFixedComponent,
      { size: 'xl', backdrop: 'static', centered: true, keyboard: false }
    );
    modalRef.componentInstance.modalSetup = this.fixedModalSetup();
    modalRef.result
      .then((data: FixedExpiryModalResponse) => {
        this.isFixedExpiryPolicy = data.isFixedExpiryPolicy;
        this.updateProductExpiryDate(data.fixedExpiryDate);
        this.updateSelectedExpiryScheme(data.expirySchemeList);
      })
      .catch(() => { });
  }

  private fixedModalSetup(): FixedExpiryModalSetup {
    if (this.selectedExpirySchemes.length > 1) {
      const e = Error(this.MORE_THAN_ONE_SELECTED);
      this.errorThrown.emit(e);
      throw e;
    }
    this.expirySchemeListMap.get(this.fixedGeneratorEnum)?.forEach(x => {
      x.checked = this.selectedExpirySchemes.findIndex(se => se.id === x.id) !== -1;
    });
    return {
      expirySchemeList: this.expirySchemeListMap.get(this.fixedGeneratorEnum) ?? [],
      fixEndOfDayId: this.fixEndOfDayId,
      fixedExpiryDate: this.getNgbDateStructFromDate(this.productExpiryDate),
      minDate: this.getNgbDateStructFromDate(this.todayDate),
    } as FixedExpiryModalSetup;
  }

  private updateProductExpiryDate(ngbDate: NgbDateStruct | undefined) {
    this.productExpiryDate = this.getDateFromNgbDateStruct(ngbDate);
  }

  private updateSelectedExpiryScheme(expirySchemeList: ExpirationPolicy[]) {
    this.isModified = true;
    this.selectedExpirySchemes$.next(
      expirySchemeList.filter(x => x.checked) ?? []
    );
  }

  openFlexibleModal(): void {
    const modalRef = this.ngbModal.open(
      ExpirySchemeFlexibleComponent,
      { size: 'xl', backdrop: 'static', centered: true, keyboard: false }
    );
    modalRef.componentInstance.modalSetup = this.flexibleModalSetup();
    modalRef.result
      .then((data: FlexibleExpiryModalResponse) => {
        this.isFixedExpiryPolicy = data.isFixedExpiryPolicy;
        this.updateSelectedExpiryScheme(data.expirySchemeList);
      })
      .catch(() => { });
  }

  private flexibleModalSetup(): FlexibleExpiryModalSetup {
    this.expirySchemeListMap.get(this.flexibleGeneratorEnum)?.forEach(x => {
      x.checked = this.selectedExpirySchemes.findIndex(se => se.id === x.id) !== -1;
    });
    return {
      expirySchemeList: this.expirySchemeListMap.get(this.flexibleGeneratorEnum) ?? [],
    } as FlexibleExpiryModalSetup;
  }

  removeExpiryScheme(index: number) {
    this.isModified = true;
    this.productExpiryDate = undefined;
    this.isFixedExpiryPolicy = false;
    this.selectedExpirySchemes.splice(index, 1);
    this.selectedExpirySchemes$.next(this.selectedExpirySchemes);
  }

  private setFixEndOfDayId() {
    this.fixEndOfDayId = this.expirySchemeList
      .filter(x => x.name.includes(this.KEYWORD_FIX_END_OF_DAY))
      .pop()?.id
      ?? 0;
    if (this.fixEndOfDayId === 0) {
      const e = Error(this.FIX_END_OF_DAY_ID_NOT_FOUND);
      this.errorThrown.emit(e);
      throw e;
    }
  }

  private setExpirySchemeListMap() {
    this.expirySchemeListMap.set(
      this.fixedGeneratorEnum,
      this.expirySchemeList.filter(x => this.productVoucherGeneratorService.isEdenredFixed(x.productVoucherGenerator)));
    this.expirySchemeListMap.set(
      this.flexibleGeneratorEnum,
      this.expirySchemeList.filter(x => this.productVoucherGeneratorService.isEdenredFlexable(x.productVoucherGenerator)));
  }

  private setSelectedExiprySchemesByIds(idList: number[]) {
    let selected = this.expirySchemeList.filter(x => idList.indexOf(x.id) !== -1);
    this.selectedExpirySchemes$.next(selected);
    if (this.componentSetup.toValidateOnInit) {
      const isExpiryValid = this.productVoucherGeneratorService
        .validate(selected, true, this.isFixedExpiryPolicy, this.productExpiryDate);
      if (!isExpiryValid) {
        const e = Error(this.productVoucherGeneratorService.INVALID_ERROR);
        this.errorThrown.emit(e);
      }
    }
  }

  private setSubscriptionsForSelectedExpiry() {
    this.selectedExpirySchemes$.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.selectedExpirySchemes = x;
        if (this.isModified) {
          this.selectionChange.emit({
            selectedSchemeIds: this.selectedExpirySchemes.map(x => x.id),
            productExpiryDate: this.productExpiryDate,
            isFixedExpiryPolicy: this.isFixedExpiryPolicy,
          } as FixedFlexibleComponentEvent);
        }
      });
  }

  private getNgbDateStructFromDate(date: Date | undefined): NgbDateStruct | undefined {
    if (date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    }
    return undefined;
  }

  private getDateFromNgbDateStruct(ngbDate: NgbDateStruct | undefined): Date | undefined {
    if (ngbDate && ngbDate.year && ngbDate.month && ngbDate.day) {
      return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day, 23, 59, 59);
    }
    return undefined;
  }
}

