import { ConfirmationModalComponent, GreaterThanValidator, NgbdToastGlobal, TxcDateTimeService } from '@txc-angular/component-library';
import { BehaviorSubject, tap, filter, merge, takeUntil, Subject } from 'rxjs';
import { PopupForAddMerchantComponent } from './popup-for-add-merchant/popup-for-add-merchant.component';
import { Component, LOCALE_ID, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbDateParserFormatter, NgbTooltip, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MerchantGroupService } from 'src/app/merchant/services/merchant-group.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { Merchant, MerchantGroupMerchantMapsContract, ResponseShopCountByMerchantIds, SkuType, VnrListResponse } from 'src/app/merchant/models/merchant-group-sku.model';
import { MerchantGroup } from 'src/app/merchant/models/get-merchant-group-response.model';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { ContractSchemeEnum, ContractSkuStatusEnum, SkuTypeEnum } from 'src/app/merchant/enums/merchant-group.enum';
import { MerchantGroupSharedService } from 'src/app/merchant/services/merchant-group-shared.service';
import { DateOutputValues, DatePickerType } from 'src/app/merchant/enums/date-picker.enum';
import { formatDate } from '@angular/common';

@Component({
  selector: 'merchant-group-sku-management',
  templateUrl: './merchant-group-sku-management.component.html',
  styleUrls: ['./merchant-group-sku-management.component.scss']
})
export class MerchantGroupSkuManagementComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  readonly TODAY: Date = new Date();
  readonly MERCHANTDETAILS = 'merchantDetails';
  readonly CONTRACTDETAILS = 'contractDetails';
  readonly NO_VALID_DURATION = '';

  readonly ContractSchemeEnum = ContractSchemeEnum;
  readonly DatePickerTypeEnum = DatePickerType;

  selectedTenantUTC!: string;
  isEdit = true;
  merchantId: number;
  skuId: number;
  redirectAction: string = '';
  merchantGroupId: number = 0;
  merchantList: Merchant[] = [];
  contractSkuCostsDictionary: any = [];
  isLoading$ = new BehaviorSubject<boolean>(false);
  editableSkuContracts: number[] = [];
  taxRate: number = 1;
  destroy$ = new Subject();

  skuTypeDroupdown: SkuType[] = [];
  skuTypeDroupdownDictionary: SkuType[] = [];
  vnrList: VnrListResponse[] = [];
  tenant!: string;
  displayToastLatency: number = 2000;
  skuGroupForm = this.formBuilder.group({
    skuName: ['', [Validators.required, Validators.maxLength(127)]],
    skuNumber: ['', [Validators.required, Validators.maxLength(127)]],
    skuTypeId: [null, [Validators.required, Validators.maxLength(127)]],
    faceValueWithTax: ['', [Validators.required, Validators.max(20000000.00), GreaterThanValidator.isGreaterThan(0)]],
    multiplier: [null],
    voucherNumberRuleId: [null, [Validators.required, Validators.maxLength(127)]],
    contractScheme: [null, [Validators.required]],
    contractSkuCosts: this.formBuilder.array([
      this.formBuilder.group({
        name: [''],
        skuCostId: [null],
        merchantId: [''],
        shopAmount: [0],
        contractList: [''],
        contractId: [0],
        costWithTax: [null, Validators.max(99999999999.9999)],
        costWithoutTax: [null],
        originValidStartDate: [''],
        originValidEndDate: [''],
        validStartDate: ['', Validators.required],
        validEndDate: ['', Validators.required],
        period: ['', Validators.required],
        isExpiredPeriod: [false],
        isEditablePeriod: [false],
        isNewEdited: false,
      }) as FormGroup
    ]),
  });

  // Error list
  basicErrorList: ErrorMsgEnum[] = [];
  contractErrorList: ErrorMsgEnum[] = [];

  get contractSkuCosts(): FormArray {
    return this.skuGroupForm.get('contractSkuCosts') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
    private merchantGroupService: MerchantGroupService,
    private merchantGroupSharedService: MerchantGroupSharedService,
    private utilityService: UtilityService,
    private readonly _txcDateTimeService: TxcDateTimeService,
    @Inject(LOCALE_ID) public locale: string,
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this._tenantConfigService.getTenant(tenantFromRoute).name;
    const idFromRoute = this.activatedRoute.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    const skuIdRoute = this.activatedRoute.snapshot.queryParamMap.get('skuId');
    this.skuId = skuIdRoute ? +skuIdRoute : 0;
    this.selectedTenantUTC = utilityService.FetchLocalTimeFromUTC();
    const actionData = this.activatedRoute.snapshot.queryParamMap.get('action');
    this.redirectAction = actionData ? actionData : '';
  }

  ngOnInit(): void {
    this.contractSkuCosts.clear();
    this.getMerchantGroupId();
    this.getSkuTypeDropdownList();
    this.getVnrDropdownList();
    this.getTaxRate();

    this.activatedRoute.url.subscribe(url => {
      if (url[2].path === 'edit') {
        this.isEdit = true;
        this.getGroupSkuDetailsBySkuId();
        this.disableInputsInEditMode();
      } else {
        this.isEdit = false;
      }
    })
  }

  getMerchantGroupId() {
    this.merchantGroupService.getMerchantGroupByMerchantId(this.merchantId).subscribe({
      next: res => {
        const result = JSON.parse(res.data);
        const mg: MerchantGroup = result?.merchantGroups?.items ? result.merchantGroups.items[0] : {};
        this.merchantGroupId = mg?.merchantGroupId ? mg?.merchantGroupId : 0;
        this.merchantGroupService.merchantGroupId = mg?.merchantGroupId ? mg?.merchantGroupId : 0;
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => {
        this.getMerchantDefaultContracts();
      }
    })
  }

  getVnrDropdownList(merchantId = this.merchantId) {
    this.merchantGroupService.getGroupVnrByMerchantGroupId(merchantId).subscribe(res => {
      const list = JSON.parse(res.data);
      this.vnrList = list.voucherNumberRules?.items;
    });
  }

  getSkuTypeDropdownList() {
    this.merchantGroupService.getSkuType().subscribe(res => {
      const list = JSON.parse(res.data);
      this.skuTypeDroupdownDictionary = list.contractSkuTypes.items;
      if (!this.isEdit) {
        this.skuGroupForm.get('contractScheme')?.setValue(ContractSchemeEnum.Percentage);
        this.setSkuTypeOptions(ContractSchemeEnum.Percentage);
      } else {
        this.skuTypeDroupdown = list.contractSkuTypes.items;
      }
    });
  }

  disableInputsInEditMode() {
    this.skuGroupForm.get('contractScheme')?.disable();
    this.skuGroupForm.get('voucherNumberRuleId')?.disable();
    this.skuGroupForm.get('skuNumber')?.disable();
    this.skuGroupForm.get('faceValueWithTax')?.disable();
    this.skuGroupForm.get('skuNumber')?.disable();
    this.skuGroupForm.get('skuTypeId')?.disable();
    this.skuGroupForm.get('multiplier')?.disable();
  }

  getGroupSkuDetailsBySkuId(skuId = +this.skuId) {
    this.merchantGroupService.getGroupSkuDetailsBySkuIdForViewOnly(skuId).subscribe({
      next: (res: any) => {
        const result = JSON.parse(res.data);
        const details = result?.contractSKUDetails.items[0];
        const contractScheme = details?.skuType?.id % 2 === 0 ? ContractSchemeEnum.Percentage : ContractSchemeEnum.Fixed;
        this.skuGroupForm.get('contractScheme')?.setValue(contractScheme);
        details['voucherNumberRuleId'] = +details?.voucherNumberRule?.voucherNumberRuleId;
        details['skuTypeId'] = details?.skuType.id;
        this.skuGroupForm.patchValue(details);
        details?.contractSKUCosts
          .forEach((contract: any) => {
            this.editableSkuContracts.push(contract.contractId);
            const filteredContractList = [{
              contractId: contract.contractId,
              contractName: '',
            }];
            const merchantData = {
              name: '',
              merchantId: '',
              shopAmount: 0,
              contractList: filteredContractList,
              skuCostId: contract.id,
              contractId: contract.contractId,
              costWithTax: contract.costWithTax,
              costWithoutTax: contract.costWithoutTax,
              originValidStartDate: contract.validStartDate,
              originValidEndDate: contract.validEndDate,
              validStartDate: this.toLocalDateString(contract.validStartDate),
              validEndDate: this.toLocalDateString(contract.validEndDate),
              isExpiredPeriod: this.isLessThanToday(contract.validEndDate),
              isEditablePeriod: new Date(contract.validStartDate) > this.TODAY,
            }
            if (contract.contractSkuStatus.id === ContractSkuStatusEnum.Approved) {
              this.addRowToTable(merchantData);
            }
          });
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => {
        this.getContractInfoAndMerchantInfo()
      }
    });
  }

  getContractInfoAndMerchantInfo() {
    this.merchantGroupService.getContractsDetails(this.editableSkuContracts).subscribe({
      next: (res: any) => {
        const result = JSON.parse(res.data);
        if (result.contractInfo.items) {
          result.contractInfo.items.forEach((contractInfo: any, i: number) => {
            const contractData = [{
              contractId: contractInfo.contractId,
              contractName: contractInfo.contractName,
              costSchemeId: contractInfo.costSchemeId,
            }];
            result.contractInfo.items[i].contractData = contractData;
          });
          this.contractSkuCosts.value.forEach((sku: any, i: number) => {
            const index = result.contractInfo.items.findIndex((skuContract: any) => sku.contractList[0].contractId === skuContract.contractId);
            this.contractSkuCosts.controls[i].get('contractList')?.setValue(result.contractInfo.items[index].contractData);
            this.contractSkuCosts.controls[i].get('merchantId')?.setValue(result.contractInfo.items[index].merchant.merchantId);
            this.contractSkuCosts.controls[i].get('name')?.setValue(result.contractInfo.items[index].merchant.name);
          });
        }
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => {
        this.getShopsByMerchants();
      }
    })
  }



  setSkuTypeOptions(scheme: number = this.skuGroupForm.get('contractScheme')?.value) {
    if (scheme === ContractSchemeEnum.Percentage) {
      this.skuTypeDroupdown = this.skuTypeDroupdownDictionary.filter(e => e.id === SkuTypeEnum.ValueBased || e.id === SkuTypeEnum.DynamicFaceValue);
    } else {
      this.skuTypeDroupdown = this.skuTypeDroupdownDictionary.filter(e => e.id === SkuTypeEnum.ProductBased || e.id === SkuTypeEnum.SmarBooklet);
    }
  }

  onContractSchemeChange() {
    if (this.isEdit) { return }; // Can not change ContractScheme in Edit Mode 
    this.skuGroupForm.get('skuTypeId')?.reset(null);
    this.setSkuTypeOptions();
    this.contractSkuCosts.clear();
    this.getMerchantDefaultContracts();
  }

  getMerchantDefaultContracts() {
    const contractScheme = this.skuGroupForm.get('contractScheme')?.value;
    this.merchantGroupService.getMerchantContractsByGroupId(this.merchantGroupId, contractScheme)
      .pipe(
        tap(() => this.isLoading$.next(true))
      )
      .subscribe({
        next: (res: any) => {
          const list = JSON.parse(res.data);
          const merchantList: MerchantGroupMerchantMapsContract[] = list.merchantGroupMerchantMaps.items;
          this.merchantList = merchantList.map(e => e.merchant);
          merchantList.map(merchant => {
            const merchantCreationDefaultData = {
              name: merchant.merchant?.name,
              merchantId: merchant.merchant.merchantId,
              shopAmount: 0,
              contractList: [],
              contractId: '',
              costWithTax: '',
              costWithoutTax: '',
              validStartDate: '',
              validEndDate: '',
            }
            if (!this.isEdit) {
              this.addRowToTable(merchantCreationDefaultData);
            }
            this.contractSkuCostsDictionary.push(merchantCreationDefaultData);
          });

          this.isLoading$.next(false);
        },
        error: err => {
          this.isLoading$.next(false);
          this.toast.showDanger(err.error.Message ?? err.error.message);

          if (err.message === 'Invalid model') {
            this.toast.showDanger(err.data[0] ?? err.data[0]);
          }
        },
        complete: () => {
          this.getShopsByMerchants();
        }
      }
      );
  }

  getContractDetailsListByMerchantId(merchantId: number, i: number) {
    const contractScheme = this.skuGroupForm.get('contractScheme')?.value
    if ((<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('contractList')?.value.length > 0) {
      return
    }
    this.merchantGroupService.getContractListByMerchantId(merchantId).subscribe({
      next: res => {
        const result = JSON.parse(res.data);
        const filteredContractList = result.contracts.items
          .filter((e: any) => +e.costSchemeId === +contractScheme)
          .filter((e: any) => new Date(e.endDate) > this.TODAY)
          .map((e: any) => {
            e.startDate = new Date(e.startDate) > this.TODAY ? this.toLocalDateString(e.startDate) : this.toLocalDateString(this.TODAY);
            e.endDate = this.toLocalDateString(e.endDate);
            return e;
          });
        (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('contractList')?.setValue(filteredContractList);
        if (filteredContractList.length === 0) {
          (<FormArray>this.skuGroupForm.get('contractSkuCosts')).removeAt(i);
        }
      },
      error: err => {
      }
    })
  }

  dateFormat(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  addRowToTable(merchantData: any, index: number = 0, isNewAddedMerchant = false) {
    let period = '';
    if (this.isEdit && !isNewAddedMerchant) {
      period = this.isLessThanToday(merchantData.validStartDate) ? merchantData.validEndDate : `${merchantData.validStartDate} ~ ${merchantData.validEndDate}`
    }
    let contractList = merchantData.contractList;
    if (isNewAddedMerchant) {
      this.merchantGroupService.getContractInfoWithValidPeriod(merchantData.merchantId, +this.skuGroupForm.get('contractScheme')?.value, new Date(`${this.toLocalDateString(this.TODAY)} 23:59:59`).toISOString()).subscribe({
        next: res => {
          const result = JSON.parse(res.data);
          contractList = result.contractInfo.items.map((e: any) => {
            e.startDate = new Date(e.startDate) > this.TODAY ? this.toLocalDateString(e.startDate) : this.toLocalDateString(this.TODAY);
            e.endDate = this.toLocalDateString(e.endDate);
            return e;
          });
          this.contractSkuCosts.insert(index,
            this.formBuilder.group({
              name: [merchantData.name],
              skuCostId: [isNewAddedMerchant ? 0 : merchantData.skuCostId],
              merchantId: [merchantData.merchantId],
              shopAmount: [merchantData.shopAmount],
              contractList: [contractList],
              contractId: [merchantData.contractId, [Validators.required]],
              costWithTax: [merchantData.costWithTax, [, Validators.max(99999999999.9999)]],
              costWithoutTax: [merchantData.costWithoutTax],
              originValidStartDate: [merchantData.originValidStartDate],
              originValidEndDate: [merchantData.originValidEndDate],
              validStartDate: [merchantData.validStartDate],
              validEndDate: [merchantData.validEndDate],
              isNewEdited: [isNewAddedMerchant],
              period: [period],
              isExpiredPeriod: [isNewAddedMerchant ? false : merchantData.isExpiredPeriod],
              isEditablePeriod: [isNewAddedMerchant ? true: merchantData.isEditablePeriod],
            })
          );
        },
        error: err => {
        },
        complete: () => {
          (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('costWithoutTax')?.disable();
        }
      });

    } else {
      this.contractSkuCosts.insert(index,
        this.formBuilder.group({
          name: [merchantData.name],
          skuCostId: [isNewAddedMerchant ? 0 : merchantData.skuCostId],
          merchantId: [merchantData.merchantId],
          shopAmount: [merchantData.shopAmount],
          contractList: [contractList],
          contractId: [merchantData.contractId, [Validators.required]],
          costWithTax: [merchantData.costWithTax, [Validators.max(99999999999.9999)]],
          costWithoutTax: [merchantData.costWithoutTax],
          originValidStartDate: [merchantData.originValidStartDate],
          originValidEndDate: [merchantData.originValidEndDate],
          validStartDate: [merchantData.validStartDate],
          validEndDate: [merchantData.validEndDate],
          isNewEdited: [isNewAddedMerchant],
          period: [period],
          isExpiredPeriod: [merchantData.isExpiredPeriod],
          isEditablePeriod: [merchantData.isEditablePeriod],
        })
      );
      if (this.isEdit) {
        (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('contractId')?.disable();
      }
      if (this.isEdit && new Date(merchantData.validStartDate) <= new Date()) {
        (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('costWithTax')?.disable();
      }
    }
    (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('costWithoutTax')?.disable();
  }

  calCostWithoutTax(index: number) {
    const costWithTax = (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('costWithTax')?.value;
    const value = Number(Math.round(parseFloat((costWithTax / this.taxRate) + 'e' + 4)) + 'e-' + 4);
    (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('costWithoutTax')?.setValue(value);
  }

  private getTaxRate() {
    this.merchantGroupService.getTaxRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.toast.showDanger(`Error in getting the tax rate for master product.`);
            return;
          }
          const data = JSON.parse(res.data);
          this.taxRate = data.taxRateByTenantId?.companyTaxRate;
          if (this.taxRate == null || isNaN(this.taxRate!)) {
            this.toast.showDanger(`Error in getting the tax rate for master product.`);
          }
        },
        error: () => {
          this.toast.showDanger(`Error in getting the tax rate for master product.`);
        },
        complete: () => { }
      });
  }

  getShopsByMerchants() {
    const merchantIdList = this.merchantList.map(e => e.merchantId);
    this.merchantGroupService.getShopCountByMerchantIdsAndStatus(merchantIdList).subscribe({
      next: res => {
        const list: ResponseShopCountByMerchantIds = JSON.parse(res.data);
        list.shopCountByMerchantIds.forEach((shop) => {
          const contractSkuCostsList = this.contractSkuCosts.value;
          const index = contractSkuCostsList.findIndex((e: any) => e.merchantId === shop.id);
          if (!isNaN(index) && index >= 0) {
            (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[index].get('shopAmount')?.setValue(shop.count);
          }
        });
        if (!this.isEdit) {
          this.contractSkuCostsDictionary = this.skuGroupForm.get('contractSkuCosts')?.value;
        }
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => {
        this.contractSkuCosts.controls.sort((a: any, b: any) => a.value.name.localeCompare(b.value.name));
        this.contractSkuCosts.value.sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    });
  }

  isDeleteDisabled(startDate: string, isNewEdited: boolean): boolean {
    return !isNewEdited
  }

  openModal() {
    const modalRef = this.modalService.open(PopupForAddMerchantComponent, { centered: true });
    modalRef.componentInstance.data = this.merchantList;
    modalRef.closed.subscribe(merchantId => {
      if (merchantId === 'cancel' || !merchantId) { return; }
      const contractSkuCostsList = this.contractSkuCosts.getRawValue();
      const indexInTable = contractSkuCostsList.findIndex((e: any) => +e.merchantId === +merchantId);
      const contract = this.contractSkuCostsDictionary.find((e: any) => +e.merchantId === +merchantId);
      if (indexInTable === -1) {
        this.getShopsByMerchants();
        this.addRowToTable(contract, 0, true);
      } else {
        this.addRowToTable(contractSkuCostsList[indexInTable], indexInTable + 1, true);
      }
    });
  }

  deleteRow(i: number) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
    modalRef.componentInstance.title = 'Delete Merchant';
    modalRef.componentInstance.description =
      'Are you sure you want to delete this Merchant';
    modalRef.componentInstance.firstButton = {
      buttonText: 'Cancel',
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: 'Delete',
      buttonClass: 'btn-primary',
    };

    modalRef.closed.subscribe(btn => {
      if (btn === 'confirm') {
        this.removeMerchant(i);
      }
    });
  }

  removeMerchant(i: number) {
    this.contractSkuCosts.removeAt(i);
  }

  getCostAndPeriod(i: number) {
    const contractId = (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('contractId')?.value;
    if (!contractId) {
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('costWithTax')?.reset();
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('costWithoutTax')?.reset();
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validStartDate')?.reset();
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validEndDate')?.reset();
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('period')?.reset();
      return;
    }
    const list = (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('contractList')?.value;
    const contract = list.find((c: any) => c.contractId === +contractId);

    if (this.skuGroupForm.get('contractScheme')?.value === ContractSchemeEnum.Percentage) {
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('costWithTax')?.setValue(+contract.costPercentage);
      (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('costWithoutTax')?.setValue(+contract.costPercentage);
    }
    (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validStartDate')?.setValue(contract.startDate);
    (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validEndDate')?.setValue(contract.endDate);
    (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('period')?.setValue(`${contract.startDate} ~ ${contract.endDate}`);
  }

  isDuplicateMerchantDetails(i: number): boolean {
    return (i - 1 >= 0) && this.contractSkuCosts.value[i].merchantId === this.contractSkuCosts.value[i - 1].merchantId;
  }

  navigateToMerchantGroupDetails(merchantId: number) {
    const merchantGroupMidFromRoute = this.activatedRoute.snapshot.queryParamMap.get('merchantGroupMid');
    if (merchantGroupMidFromRoute != null && merchantGroupMidFromRoute != '') {
      merchantId = merchantGroupMidFromRoute ? Number.parseInt(merchantGroupMidFromRoute) : 0;
    }
    if (this.redirectAction === this.CONTRACTDETAILS) {
      var contractId = history.state?.contractId;
      this._router.navigate(['merchants/contract/details/' + contractId],
        {
          queryParams: {
            merchantId: merchantId
          }
        });
    }
    else if (this.redirectAction === this.MERCHANTDETAILS) {
      this._router.navigate(['merchants/details'],
        {
          queryParams: {
            merchantId: merchantId
          },
          state: {
            action: 'SKUUpdated'
          }
        });
    } else {
      this._router.navigate(['merchants/merchant-group-details'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: merchantId,
          }
        });
    }
  }

  toLocalDateString(date: any): string {
    if (!date) { return ''; }
    let localDate = new Date(this._txcDateTimeService.getLocalDateTime(date));
    return formatDate(localDate, 'yyyy/MM/dd', this.locale);
  }


  save() {
    this.skuGroupForm.markAllAsTouched();
    if (this.skuGroupForm.invalid) { return; }
    if (+this.skuGroupForm.get('skuTypeId')?.value !== SkuTypeEnum.SmarBooklet) {
      this.skuGroupForm.removeControl('multiplier');
    }
    if (+this.skuGroupForm.get('skuTypeId')?.value === SkuTypeEnum.DynamicFaceValue) {
      this.skuGroupForm.removeControl('faceValueWithTax');
    }

    const body = this.skuGroupForm.getRawValue();
    body['merchantGroupId'] = this.merchantGroupId;
    body['skuTypeId'] = +body['skuTypeId'];
    body['voucherNumberRuleId'] = +body['voucherNumberRuleId'];
    if (+this.skuGroupForm.get('skuTypeId')?.value === SkuTypeEnum.DynamicFaceValue) {
      body['faceValueWithTax'] = +body['faceValueWithTax'];
    }
    // Create
    if (!this.isEdit) {
      body.contractSkuCosts = body.contractSkuCosts
        .map((contractSku: any) => {
          const contractRequest = {
            contractId: contractSku.contractId,
            costWithTax: contractSku.costWithTax,
            validStartDate: new Date(this.merchantGroupSharedService.convertUserDateToDateWithTanentTimeZone(new Date(`${contractSku.validStartDate} 00:00:00`))).toISOString(),
            validEndDate: new Date(this.merchantGroupSharedService.convertUserDateToDateWithTanentTimeZone(new Date(`${contractSku.validEndDate} 23:59:59`))).toISOString(),
            statusId: ContractSkuStatusEnum.Approved,
          }
          return contractRequest;
        });
      this.createSkuWithcontractSkuCostsList(body);
    } else {
      // Update 
      body.contractSkuCosts = body.contractSkuCosts
        .filter((contractSku: any) => contractSku.isExpiredPeriod === false
        )
        .map((contractSku: any) => {
          let startDate;
          let endDate;
          if (contractSku.isExpiredPeriod) {
            endDate = contractSku.originValidEndDate;
          } else {
            endDate = new Date(this.merchantGroupSharedService.convertUserDateToDateWithTanentTimeZone(new Date(`${contractSku.validEndDate} 23:59:59`))).toISOString();
          }

          if (this.isLessThanToday(contractSku.validStartDate) && !contractSku.isNewEdited) {
            startDate = contractSku.originValidStartDate;
          } else {
            startDate = new Date(this.merchantGroupSharedService.convertUserDateToDateWithTanentTimeZone(new Date(`${contractSku.validStartDate} 00:00:00`))).toISOString();
          }

          const contractRequest = {
            contractId: contractSku.contractId,
            costWithTax: +contractSku.costWithTax,
            validStartDate: startDate,
            validEndDate: endDate,
            statusId: ContractSkuStatusEnum.Approved,
            skuCostId: contractSku.skuCostId ?? 0,
          }
          return contractRequest;
        });
      this.updateSkuWithcontractSkuCostsList(body)
    }
  }

  createSkuWithcontractSkuCostsList(body: any) {
    this.merchantGroupService.createSkuMerchantGroup(body).subscribe({
      next: res => {
        this.toast.showSuccess('Group SKU created successfully');
        setTimeout(() => this.navigateToMerchantGroupDetails(this.merchantId), this.displayToastLatency);
      },
      error: err => {
        this.isLoading$.next(false);
        if (err.error.Message) {
          this.toast.showDanger(err.error.message);
        }

        if (err.error.message === 'Invalid model') {
          this.basicErrorList = err.error.data.map((e: string) => ({
            errorMessage: e
          }));
        } else {
          this.basicErrorList = err.error.data?.skuValidationError
          this.contractErrorList = err.error.data?.skuCostValidationError;
        }
        this.toast.showDanger(err.error.Message ?? err.error.message);
      }
    })
  }

  updateSkuWithcontractSkuCostsList(preBody: any) {
    const body: any = {
      merchantGroupId: preBody.merchantGroupId,
      skuId: this.skuId,
      skuName: preBody.skuName,
      contractSkuCosts: preBody.contractSkuCosts,
    }
    if (preBody.skuTypeId === SkuTypeEnum.SmarBooklet) {
      body['multiplier'] = preBody.multiplier;
    };
    if (preBody.skuTypeId !== SkuTypeEnum.DynamicFaceValue) {
      body['faceValueWithTax'] = preBody.faceValueWithTax;
    };
    this.merchantGroupService.updateSkuMerchantGroup(body).subscribe({
      next: res => {
        this.toast.showSuccess('Group SKU updated successfully');
        setTimeout(() => this.navigateToMerchantGroupDetails(this.merchantId), this.displayToastLatency);
      },
      error: err => {
        this.isLoading$.next(false);
        if (err.error.Message) {
          this.toast.showDanger(err.error.message);
        }

        if (err.error.message === 'Invalid model') {
          this.basicErrorList = err.error.data.map((e: string) => ({
            errorMessage: e
          }));
        } else {
          this.basicErrorList = err.error.data?.skuValidationError
          this.contractErrorList = err.error.data?.skuCostValidationError;
        }
        this.toast.showDanger(err.error.Message ?? err.error.message);
      }
    })
  }

  // validator tooltip related
  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl, errorMessage?: string) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open(formControl);
    }
  }

  dateChange(event: DateOutputValues, i: number) {
    if (event) {
      this.skuGroupForm.get('period')?.setValue(
        event?.selectedDateRange || event?.simpleDate
      );
      let dateRange = event?.selectedDateRange ? event?.selectedDateRange.split("~") : '';
      if (dateRange.length === 2) {
        const startDate = dateRange[0].trim();
        const endDate = dateRange[1].trim();
        (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validStartDate')?.setValue(startDate);
        (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validEndDate')?.setValue(endDate);
      } else {
        (<FormArray>this.skuGroupForm.get('contractSkuCosts')).controls[i].get('validEndDate')?.setValue(event?.simpleDate);
      }

    }
  }

  isLessThanToday(isoDate: string | undefined): boolean {
    return isoDate ? new Date(isoDate) < this.TODAY : false;
  }


  get f(): any {
    return this.skuGroupForm.controls;
  }

  onSkuTypeChange() {
    this.skuGroupForm.get('faceValueWithTax')?.reset(null);
    this.skuGroupForm.get('multiplier')?.reset(null);

    if (+this.skuGroupForm.get('skuTypeId')?.value === SkuTypeEnum.DynamicFaceValue) {
      this.skuGroupForm.removeControl('faceValueWithTax');
    } else {
      this.skuGroupForm.addControl('faceValueWithTax', new FormControl(null, [Validators.required, Validators.max(20000000.00), GreaterThanValidator.isGreaterThan(0)]));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

export interface ErrorMsgEnum {
  columnName: string,
  errorMessage: string,
  referenceKey: string,
}
