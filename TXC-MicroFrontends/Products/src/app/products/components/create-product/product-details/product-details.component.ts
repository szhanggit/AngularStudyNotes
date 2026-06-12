import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, merge, Observable, of, OperatorFunction, ReplaySubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ProductCustomizationService } from '../../../services/product-customization.service';
import { NgbModal, NgbTooltip, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ProductType } from '../../../models/product-type.model';
import { Merchant } from 'src/app/products/models/merchant.model';
import { MerchantService } from 'src/app/products/services/merchant.service';
import { ProgramService } from 'src/app/products/services/program.service';
import { VoucherNumberRuleService } from 'src/app/products/services/voucher-number-rule.service';
import { IProgram } from 'src/app/products/models/program.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { AcceptanceLoop, GroupAcceptanceLoop } from 'src/app/products/models/acceptance-loop.model';
import { AcceptanceLoopService } from 'src/app/products/services/acceptance-loop.service';
import { SkuService } from 'src/app/products/services/sku.service';
import { SKU } from 'src/app/products/models/sku.model';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from 'src/app/products/services/media.service';
import { Brand } from 'src/app/products/models/brand.model';
import { Media } from 'src/app/products/models/media.model';
import { BrandService } from 'src/app/products/services/brand.service';
import { Dictionary } from 'src/app/products/models/dictionary.model';
import { ProductService } from 'src/app/products/services/product.service';
import { MerchantGroupService } from 'src/app/products/services/merchant-group.service';
import { GraphqlCollectionSegment } from 'src/app/products/models/graphql-collection-segment.model';
import { Select2Data } from 'ng-select2-component';
import { BaseResponse } from 'src/app/products/models/base-response.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  @Input() toast!: NgbdToastGlobal;
  @Input() detailsFormGroup!: FormGroup;
  @Input() selectedTenant!: string;
  @Input() selectedType!: ProductType;
  @Input() selectedMerchant: Merchant | undefined = undefined;
  @Input() merchantProgram!: IProgram;
  @Input() isMonoMerchant = true;
  @Input() selectedMerchantGroupId!: number;
  @Input() selectedSKU!: SKU | undefined;
  @Input() acceptanceLoopPage!: number;
  @Input() editMode: boolean = false;
  @Input() stepsReached: number[] = [];
  showResellerMerchantName: boolean = false;

  _skuList: SKU[] = [];
  skuListSelect2Data: Select2Data = [];
  productId!: Number;
  get skuList() {
    return this._skuList;
  }
  @Input() set skuList(value: SKU[]) {
    this._skuList = value;
  }

  @Input() brandList: Brand[] = [];

  _merchantAcquirers: Dictionary[] = [];
  merchantAcquirersSelect2Data: Select2Data = [];
  get merchantAcquirers(): Dictionary[] {
    return this._merchantAcquirers;
  }
  @Input() set merchantAcquirers(value: Dictionary[]) {
    this._merchantAcquirers = value;
    this.merchantAcquirersSelect2Data = value.map((v: Dictionary) => {
      return {
        value: v.dictionaryId,
        label: v.displayName
      };
    });
  };

  @Input() acceptanceLoopList: AcceptanceLoop[] = [];
  @Input() selectedAcceptanceLoop!: AcceptanceLoop;

  @Input() voucherNumberRuleList: VoucherNumberRule[] = [];
  @Input() vnrErrorMessage!: string;

  @Input() shopCount!: number;

  @Output() merchantSKUChanged = new EventEmitter<({
    merchant: Merchant,
    sku: SKU, skuList: SKU[];
    acceptanceLoopList: AcceptanceLoop[],
    vrnList: VoucherNumberRule[],
    program: IProgram,
    shopCount: number,
    programGeneratedByChanged: boolean,
    isMonoMerchant: boolean
  })>();
  @Output() acceptanceLoopPaginationChanged = new EventEmitter<number>();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  brandOnHover = false;
  selectedMedia!: Media;

  productTags: ({ value: number, label: string })[] = [
    {
      value: 1,
      label: 'Delivery'
    }, {
      value: 2,
      label: 'Paper'
    }, {
      value: 4,
      label: 'Digital'
    }
  ];
  multipleSelectionTypes: ({ value: number, label: string })[] = [
    {
      value: 0,
      label: 'Select'
    },
    {
      value: 1,
      label: 'Master'
    }, {
      value: 2,
      label: 'Child'
    }
  ];
  productCategories: ({ value: number, label: string })[] = [
    {
      value: 1,
      label: 'Actual'
    }, {
      value: 2,
      label: 'Promotional'
    }
  ];

  productIssuers = [
    {
      value: 0,
      label: 'IssuerModel'
    },
    {
      value: 2,
      label: 'ResellerModel'
    },
    {
      value: 3,
      label: 'WhiteLabel'
    }
  ];

  // typeahead
  focusBrand$ = new Subject<string>();
  focusMerchant$ = new Subject<string>();
  focusResellerMerchant$ = new Subject<string>();
  focusSKU$ = new Subject<string>();

  clickBrand$ = new Subject<string>();
  clickMerchant$ = new Subject<string>();
  clickResellerMerchant$ = new Subject<string>();
  clickSKU$ = new Subject<string>();

  formatter = (result: Brand) => result.brandName;
  merchantFormatter = (result: Merchant) => result.merchantName;
  skuFormatter = (result: SKU) => result.skuName;

  // show typeahead flags
  showResellerMerchantTypeahead = true;
  showMerchantTypeahead = true;
  showBrandTypeahead = true;

  // merchants
  merchantId!: number | undefined;
  merchants: Merchant[] = [];

  // sku
  skuErrorMessage!: string;
  skuValue!: number;
  onSkuChanged$ = new BehaviorSubject<boolean>(false);
  programGeneratedByChanged = false;

  // ac
  acceptanceLoopErrorMessage!: string;

  vnrLoading$ = new BehaviorSubject<boolean>(false);
  programLoading$ = new BehaviorSubject<boolean>(false);

  // form
  get f(): any {
    return this.detailsFormGroup.controls;
  }

  constructor(
    public productCustomizationSvc: ProductCustomizationService,
    private readonly _modalService: NgbModal,
    private readonly _merchantService: MerchantService,
    private readonly _merchantGroupService: MerchantGroupService,
    private readonly _programService: ProgramService,
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _acceptanceLoopService: AcceptanceLoopService,
    private readonly _skuService: SkuService,
    private readonly _mediaService: MediaService,
    private readonly _brandService: BrandService,
    public productService: ProductService,
    _route: ActivatedRoute) {
    _route.params.subscribe(() => {
      _merchantService.reset();
    });
  }

  ngOnInit(): void {
    // US32584 - disable SKU
    if (this.editMode) {
      this.f.skuId.disable();
    }
    this.markDetailsControlsDirty();


    if (this.selectedType.key === 4) {
      this.f.productName.addValidators([Validators.pattern(/{FV}/)])
    }

    if (this.f.skuId.value) this.skuValue = parseInt(this.f.skuId.value);

    if (this.f.productIssuer.value == 2) {
      this.showResellerMerchantName = true;
      this.f.resellerMerchantName.enable();
    }

    // brand lookup
    if (this.selectedTenant !== 'GR') {
      this.f.brandName.valueChanges.pipe(debounceTime(500)).subscribe((value: any) => {
        if (!value.brandName) {
          this._brandService.getBrandsByBrandName(value).pipe(
            takeUntil(this.destroyed$),
            switchMap((res: BaseResponse) => {
              this.brandList = JSON.parse(res.data).brandsByName.items;
              const getBrandByBrandName = this.brandList.find(brand => value.toLowerCase() === brand.brandName.toLowerCase());
              if (this.showBrandTypeahead) {
                this.focusBrand$.next(value);
              } else {
                this.showBrandTypeahead = true;
              }

              if (!getBrandByBrandName) {
                this.showBrandTypeahead = false;
                this.removeBrand(false);
                return of(false);
              } else {
                this.f.brandName.setValue(getBrandByBrandName);
                this.f.brandId.setValue(getBrandByBrandName.id);
                return this._mediaService.getMediaById(getBrandByBrandName.mediaId);
              }
            })
          ).subscribe(res => {
            if (!res) return;
            const media: Media = JSON.parse((res as BaseResponse).data).mediaById[0];
            if (media) {
              this.f.brandImage.setValue(media);
            } else {
              this.toast.showDanger('Error loading media image. Please try again later.');
            }
          },
            () => {
              this.toast.showDanger('Error loading media image. Please try again later.');
            }
          );
        } else {
          this.f.brandId.setValue(value.id);
          this._mediaService.getMediaById(value.mediaId).pipe(takeUntil(this.destroyed$)).subscribe(
            res => {
              const media: Media = JSON.parse(res.data).mediaById[0];
              if (media) {
                this.f.brandImage.setValue(media);
              } else {
                this.toast.showDanger('Error loading media image. Please try again later.');
              }
            },
            () => {
              this.toast.showDanger('Error loading media image. Please try again later.');
            }
          )
        }
      });
    }

    this.f.productCode.valueChanges.subscribe((value: string) => {
      this.productService.getProductCountByProductCode(value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          const isExistedInProduct: boolean = (JSON.parse(res.data)?.products?.totalCount ?? 0) > 0;
          if (isExistedInProduct) {
            this.f.productCode.setErrors({ alreadyExists: true });
          }
        });
    });

    // merchant and reseller merchant lookup
    let isReseller = false;
    this.f.merchantName.valueChanges.subscribe((value: any) => {
      if (!value.merchantName) {
        this._merchantService.searchTerm = value;
        this._merchantGroupService.searchTerm = value;
        isReseller = false;
      } else {
        this._merchantService.searchTerm = '';
        this._merchantGroupService.searchTerm = '';
        this.resetMerchantDetails();
        this.selectedMerchant = value;
        this.merchantId = value.merchantId;
        this.selectedSKU = undefined;


        if (!value.isMerchantGroup) {
          this.isMonoMerchant = true;
          this._skuService.getSKUbyMerchantId(value.merchantId, this.selectedType.key).pipe(
            takeUntil(this.destroyed$)
          ).subscribe(
            res => {
              if (res.success) {
                this.skuList = JSON.parse(res.data).contractSkuByMerchantId.items ?? [];
                this.skuListSelect2Data = this.skuList.map((sku: SKU) => {
                  return {
                    value: sku.id,
                    label: sku.skuName
                  }
                });
                this.f.skuId.enable();
                if (!this.skuList.length) {
                  this.f.skuId.disable();
                  this.toast.showDanger('No available sku for this merchant, please go to merchant to create one');
                }
              }
            },
            () => {
              this.toast.showDanger('Error loading available SKUs. Please try again later.');
            },
            () => {
              this._acceptanceLoopService.getMonoAcceptanceLoopByMerchantId(value.merchantId).pipe(
                takeUntil(this.destroyed$)
              ).subscribe(
                res => {
                  if (res.success) {
                    this.acceptanceLoopList = JSON.parse(res.data).monoAcceptanceLoopByMerchantId.items;
                    this._acceptanceLoopService.getMerchantShop(value.merchantId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                      if (res.success) {
                        this.shopCount = res.data.totalCount;
                      }
                    });

                    if (!this.acceptanceLoopList.length) {
                      this.toast.showDanger('No available acceptance loop for this merchant, please go to merchant to create one');
                      this.acceptanceLoopErrorMessage = `No available acceptance loop for this merchant, please <a href="/merchants/details?merchantId=${value.merchantId}">go to merchant</a> to create one`;
                    } else {
                      const defaultAcceptanceLoopId = this.acceptanceLoopList.find(acceptanceLoop => acceptanceLoop.isDefault === true)?.acceptanceLoopId;
                      this.f.acceptanceLoopId.setValue(defaultAcceptanceLoopId);
                    }
                  }
                },
                () => {
                  this.toast.showDanger('Error loading acceptance loop list. Please try again later.');
                }
              );
            }
          );
        } else {
          this.isMonoMerchant = false;
          this._merchantGroupService.getGroupSkuByMerchantId(value.merchantGroupId, this.selectedType.key, true, { pageSize: 20, pageCount: 1, currentPage: 1, itemStart: 1, itemEnd: 10, total: 10 }, '').pipe(
            takeUntil(this.destroyed$)
          ).subscribe(
            res => {
              if (res.success) {
                this.skuList = JSON.parse(res.data).contractSKUDetails.items.filter((sku: SKU) => sku.skuType.id === this.selectedType.key) ?? [];
                this.f.skuId.enable();
                if (!this.skuList.length) {
                  this.f.skuId.disable();
                  this.toast.showDanger('No available sku for this merchant, please go to merchant to create one');
                }
              }
            },
            () => {
              this.f.skuId.disable();
              this.toast.showDanger('Error loading available SKUs. Please try again later.');
            }
          );

          this._acceptanceLoopService.getAcceptanceLoopsAggregationByMerchantGroupId(value.merchantGroupId, 0, 100).pipe(
            takeUntil(this.destroyed$)
          ).subscribe({
            next: (res) => {
              if (res.success) {
                let ac: GraphqlCollectionSegment<GroupAcceptanceLoop> = JSON.parse(res.data).acceptanceLoopsAggregation;

                ac.items?.forEach(x => {
                  // setting for merchant expansion
                  x.isExpanded = false;
                  x.merchantsDisplay = x.merchantAggregation.filter(merchant => merchant.status === true).slice(0, 5);

                  // special handling for default acceptance loop
                  if (x.isDefault) {
                    x.merchantAggregation.forEach(y => {
                      y.availableShopCount = y.merchantActiveShopCount;
                    });
                  }
                });

                this.acceptanceLoopList = ac.items ?? [];

                if (this.acceptanceLoopList.length) {
                  const defaultAcceptanceLoopId = this.acceptanceLoopList.find(acceptanceLoop => acceptanceLoop.isDefault === true)?.acceptanceLoopId;
                  this.f.acceptanceLoopId.setValue(defaultAcceptanceLoopId);
                }
              }
            },
            error: (err) => {
              this.toast.showDanger(err?.error?.message);
            }
          });
        }
      }
    });

    this.f.productIssuer.valueChanges.subscribe((value: number) => {
      if (value == 2) {
        this.f.resellerMerchantName.enable();
        this.showResellerMerchantName = true;
      } else {
        this.showResellerMerchantName = false;
        this.f.resellerMerchantName.setValue('');
        this.f.resellerMerchantName.disable();
        this.f.issueMerchant.setValue(0);
      }
    });
    this.f.resellerMerchantName.valueChanges.subscribe((value: any) => {
      if (!value.merchantName) {
        if (!this.editMode) {
          this._merchantService.searchTerm = value;
          isReseller = true;
        }
      }
    });

    // focus type ahead after loading merchant list
    this._merchantService.merchants$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(merchants => {
      this.merchants = merchants;
      this._merchantGroupService.merchantsGroup$.pipe(takeUntil(this.destroyed$)).subscribe(merchantGroups => {
        for (const merchantGroup of merchantGroups) {
          if (!this.merchants.some(merchant => merchant.merchantId === merchantGroup.merchantId)) {
            this.merchants.push({
              merchantName: merchantGroup.merchant?.name,
              merchantId: merchantGroup.merchantId,
              merchantGroupId: merchantGroup.merchantGroupId,
              programId: merchantGroup.merchant?.programId,
              isMerchantGroup: true
            } as any);
          }
        }

        if (merchantGroups && this.f.merchantName.value && !isReseller && this.showMerchantTypeahead) {
          this.focusMerchant$.next(this.f.merchantName.value);
        } else {
          this.showMerchantTypeahead = true;
        }
      });
      if (merchants && this.f.merchantName.value && !isReseller && this.showMerchantTypeahead) {
        this.focusMerchant$.next(this.f.merchantName.value);
      } else if (merchants && this.f.productIssuer.value && isReseller && this.f.productIssuer.value === 2 && this.showResellerMerchantTypeahead) {
        this.focusResellerMerchant$.next(this.f.resellerMerchantName.value);
      } else {
        this.showMerchantTypeahead = true;
        this.showResellerMerchantTypeahead = true;
      }
    });

    this.f.skuName.valueChanges.pipe(
      takeUntil(this.destroyed$),
      distinctUntilChanged(),
      debounceTime(200)
    ).subscribe({
      next: (value: SKU | string) => {
        if (!this.selectedMerchant) return;

        if (this.isMonoMerchant) {
          this._skuService.getSKUSmartSearch(this.selectedMerchant.merchantId, this.selectedType.key, (value as SKU).skuName ?? value)
          .pipe(takeUntil(this.destroyed$)).subscribe({
            next: (res: BaseResponse) => {
              this.skuList = JSON.parse(res.data).contractSkuByMerchantId.items;
              if ((value as SKU).skuName) return;
              this.selectedSKU = this.skuList.find(sku => sku.skuName.toLowerCase() === (value as string).toLowerCase());
              this.onSKUChanged();
              this.focusSKU$.next((value as SKU).skuName ?? value);
            }
          });
        } else {
          this._merchantGroupService.getGroupSkuByMerchantId(this.selectedMerchant.merchantGroupId ?? this.selectedMerchantGroupId, this.selectedType.key, true,
            { pageSize: 20, pageCount: 1, currentPage: 1, itemStart: 1, itemEnd: 10, total: 10 }, (value as SKU).skuName ?? value)
            .pipe(takeUntil(this.destroyed$)).subscribe({
              next: (res: BaseResponse) => {
                this.skuList = JSON.parse(res.data).contractSKUDetails.items;
                if ((value as SKU).skuName) return;
                this.selectedSKU = this.skuList.find(sku => sku.skuName.toLowerCase() === (value as string).toLowerCase());
                this.onSKUChanged();
                this.focusSKU$.next((value as SKU).skuName ?? value);
              }
            });
        }
      }
    });

    this.onSkuChanged$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((isChanged: boolean) => {
      if (!isChanged || !this.selectedSKU) return;

      if (!this.selectedSKU.contractSKUCosts.length) {
        this.toast.showDanger(`No valid cost for this SKU. Please add SKU cost and reselect SKU again`);
        return;
      }

      if (this.selectedMerchant) {
        if (this.isMonoMerchant) {
          this.f.merchantId.setValue(this.selectedMerchant.merchantId);
          this.f.merchantGroupId.setValue(this.selectedMerchant.merchantGroupId);
          this.f.isMerchantGroup.setValue(false);
        } else {
          this.f.merchantId.setValue(this.selectedMerchant.merchantId);
          this.f.merchantGroupId.setValue(this.selectedMerchant.merchantGroupId);
          this.f.isMerchantGroup.setValue(true);
        }

        if (this.selectedSKU.voucherNumberRule) {
          this.f.vnrId.setValue(this.selectedSKU.voucherNumberRule.voucherNumberRuleId);
        }

        this.f.validFrom.setValue(this.selectedSKU.contractSKUCosts[0].validStartDate);
        this.f.validTo.setValue(this.selectedSKU.contractSKUCosts[0].validEndDate);
        this.programLoading$.next(true);
        this.vnrLoading$.next(true);
        this._programService.getProgramById(this.selectedMerchant.programId).pipe(
          takeUntil(this.destroyed$)
        ).subscribe(
          res => {
            const program = JSON.parse(res.data).programs.items[0];
            this.f.programId.setValue(program.id);
            if (program) {
              if (this.merchantProgram && this.merchantProgram.isEdenred !== program.isEdenred) {
                this.programGeneratedByChanged = true;
              }
              this.merchantProgram = program;
              this._voucherNumberRuleService
                .getSpecificVoucherNumberRule(
                  this.selectedMerchant?.merchantId,
                  this.selectedSKU?.voucherNumberRule.voucherNumberRuleId
                )
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                  next: (res) => {
                    this.voucherNumberRuleList = res ?? [];
                    if (this.selectedMerchant && this.selectedSKU) {
                      this.merchantSKUChanged.emit({
                        merchant: this.selectedMerchant,
                        sku: this.selectedSKU,
                        skuList: this.skuList,
                        acceptanceLoopList: this.acceptanceLoopList,
                        vrnList: this.voucherNumberRuleList,
                        program: this.merchantProgram,
                        shopCount: this.shopCount,
                        programGeneratedByChanged:
                          this.programGeneratedByChanged,
                        isMonoMerchant: this.isMonoMerchant,
                      });
                    }
                    if (!this.voucherNumberRuleList.length) {
                      this.toast.showDanger(
                        'No available voucher number rule for this merchant, please go to merchant to create one'
                      );
                      this.vnrErrorMessage = `No available voucher number rule for this merchant, please go to <a href="/merchants/details?merchantId=${this.selectedMerchant?.merchantId}">merchant</a> to create one`;
                    }
                  },
                  error: () => {
                    this.toast.showDanger(
                      'Error loading voucher number rule list. Please try again later.'
                    );
                  },
                  complete: () => {
                    this.vnrLoading$.next(false);
                  },
                });
            } else {
              this.toast.showDanger('Error loading program details. Please try again later.')
            }
          },
          () => {
            this.toast.showDanger('Error loading program details. Please try again later.')
          }, () => {
            this.programLoading$.next(false);
          }
        );
      }
    });
  }

  markDetailsControlsDirty() {
    if (
      (this.editMode || this.stepsReached.length > 1) &&
      this.detailsFormGroup.invalid
    )
      Object.keys(this.f).forEach((key) => {
        this.detailsFormGroup.get(key)?.markAsDirty();
      });
  }

  ngOnDestroy(): void {
    this.productService.reset();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  searchResellerMerchant: OperatorFunction<string, readonly Merchant[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus$ = this.focusResellerMerchant$;
    return merge(debouncedText$, inputFocus$).pipe(
      map((term: any) => {
        if (term.merchantName) {
          return [];
        }
        return (term === '' ? this.merchants
          : this.merchants.filter(v => v.merchantName.toLowerCase().indexOf(term.merchantName ? term.merchantName.toLowerCase() : term.toLowerCase()) > -1)).slice(0, 10)
      }));
  }

  onSelectMerchantReseller($event: any) {
    this.f.issueMerchant.setValue($event.item.merchantId);
  }

  OnResellerMerchantNameTextboxChanged() {
    const value = this.detailsFormGroup.controls['resellerMerchantName'].value;
    if (
      !(
        this.merchants.some(
          (merchant) => value.merchantName || value === merchant.merchantName
        ) && this.merchants.length
      )
    ) {
      this.detailsFormGroup.controls['resellerMerchantName'].setValue('');
      this.showResellerMerchantTypeahead = false;
    }
  }

  searchBrand: OperatorFunction<string, readonly Brand[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(600),
      tap((value) => {
        if (!value) this.removeBrand();
      }),
      distinctUntilChanged()
    );
    const inputFocus$ = this.focusBrand$;
    return merge(debouncedText$, inputFocus$).pipe(
      map((term) =>
        (term === ''
          ? this.brandList
          : this.brandList.filter(
            (v) => v.brandName.toLowerCase().indexOf(term.toLowerCase()) > -1
          )
        ).slice(0, 10)
      )
    );
  }

  removeBrand(removeSearch = true): void {
    this.f.brandImage.setValue({ nodeUrl: '' });
    this.f.brandId.setValue(null);
    if (removeSearch) {
      this.f.brandName.setValue('');
    }
  }

  OnBrandTextboxChanged() {
    let value = this.detailsFormGroup.controls['brandName'].value;
    value = value.brandName ?? value;
    const getBrandByBrandName = this.brandList.find(brand => value.toLowerCase() === brand.brandName.toLowerCase());
    if (!getBrandByBrandName) {
      this.showBrandTypeahead = false;
      this.removeBrand();
    } else {
      this.f.brandId.setValue(getBrandByBrandName.id);
      this._mediaService.getMediaById(getBrandByBrandName.mediaId).pipe(takeUntil(this.destroyed$)).subscribe(
        res => {
          const media: Media = JSON.parse(res.data).mediaById[0];
          if (media) {
            this.f.brandImage.setValue(media);
          } else {
            this.toast.showDanger('Error loading media image. Please try again later.');
          }
        },
        () => {
          this.toast.showDanger('Error loading media image. Please try again later.');
        }
      )
    }
  }

  searchMerchant: OperatorFunction<string, readonly Merchant[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus$ = this.focusMerchant$;
    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? this.merchants
        : this.merchants.filter(v => v.merchantName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  searchSKU: OperatorFunction<string, readonly SKU[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus$ = this.focusSKU$;
    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? this.skuList
        : this.skuList.filter(v => v.skuName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  selectSKU($event: any) {
    if (!$event || this.skuValue === $event.id) return;
    this.skuValue = $event.item.id;
    this.selectedSKU = this.skuList.find(sku => sku.id === $event.item.id) as SKU;
    this.f.skuId.setValue($event.item.id);
    this.onSkuChanged$.next(true);
  }

  onSKUChanged() {
    const value = this.detailsFormGroup.controls['skuName'].value;
    if (!this.skuList.some(sku => value.toLowerCase() === sku.skuName.toLowerCase())) {
      this.f.skuId.setValue(null);
    } else {
      this.f.skuId.setValue(this.selectedSKU?.id);
      if (!this.selectedMerchant || !this.selectedSKU) return;
      this.selectSKU({item: this.selectedSKU});
    }
  }

  removeMerchant(): void {
    this.selectedMerchant = undefined;
    this.resetMerchantDetails();
  }

  OnMerchantNameTextboxChanged() {
    const value = this.detailsFormGroup.controls['merchantName'].value;
    if (!(this.merchants.some(brand => value === brand.merchantName) && this.merchants.length)) {
      this.detailsFormGroup.controls['merchantName'].setValue('');
      this.showMerchantTypeahead = false;
      this.removeMerchant();
    }
  }

  resetMerchantDetails(): void {
    this.merchantId = undefined;
    this.selectedSKU = undefined;
    this.skuValue = 0;
    this.voucherNumberRuleList = [];
    this.acceptanceLoopList = [];
    this.acceptanceLoopPage = 1;

    this.f.merchantId.setValue('');
    this.f.merchantName.setValue('');
    this.f.skuId.setValue('');
    this.f.skuName.setValue('');
    this.f.acceptanceLoopId.setValue('');
    this.f.vnrId.setValue('');
    this.f.programId.setValue('');
    this.f.validFrom.setValue(null);
    this.f.validTo.setValue(null);
  }

  OnAcceptanceLoopSelectionChanged($event: number) {
    this.f.acceptanceLoopId.markAsDirty();
    this.f.acceptanceLoopId.setValue($event);
  }

  OnAcceptanceLoopPaginationChanged($event: number) {
    this.acceptanceLoopPaginationChanged.emit($event);
  }

  openModal(content: TemplateRef<NgbModal>): void {
    this._modalService.open(content, { size: 'sm', backdrop: 'static', centered: true });
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl, formControlName = '') {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl: formControl, formControlName: formControlName });
    }
  }

  OnSubmit() {

  }
}
