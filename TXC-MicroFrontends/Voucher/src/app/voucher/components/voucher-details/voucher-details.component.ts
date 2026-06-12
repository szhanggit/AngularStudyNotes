import { OperationHistoryComponent } from './../operation-history/operation-history.component';
import { emailProviderList } from './../../../../../../Clients/src/app/client/models/client.model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { DistributionTypeEnum } from '../../enum/distribution-type';
import { VoucherApiService } from '../../service/voucher-api.service';
import { TenantConfigService } from '../../service/tenant-config.service';
import { Subject, takeUntil } from 'rxjs';
import { AssociationStatusEnum, VoucherStatusEnum, VoucherTypeEnum } from '../../enum/voucher-status.enum';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html',
  styleUrls: ['./voucher-details.component.scss']
})
export class VoucherDetailsComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  readonly distributionTypeEnum = DistributionTypeEnum;
  readonly voucherStatusEnum = VoucherStatusEnum;
  readonly voucherTypeEnum = VoucherTypeEnum;
  @ViewChild('editEmailOrPhoneTemplate') editEmailOrPhoneTemplate!: TemplateRef<any>;
  @ViewChild('resendTemplate') resendTemplate!: TemplateRef<any>;

  tenant!: string;
  voucherType: VoucherTypeEnum = this.voucherTypeEnum.NORMAL;
  destroy$ = new Subject();
  voucherInfo = {
    voucherId: '',
    voucherNumber: '',
    guid: '',
    status: this.voucherStatusEnum.ALL,
  };
  voucherBasicInfo = {
    clientName: '',
    quotaionNo: '',
    projectName: '',
    businessModel: '',
    orderNo: '',
    skuName: '',
    skuCode: '',
    productType: '',
    publishDate: '',
    activateDate: '',
    expiryDate: '',
    capturedCount: 0,
  }

  editType: DistributionTypeEnum = this.distributionTypeEnum.EMAIL;
  distributionConfig: any;
  showDistribution = false;
  serviceProvider = 1;
  serviceProviderList: any[] = [];

  // Memo related
  updateMemoContent = '';
  voucherMemo: string = '';
  orderMemo: string = '';
  clientMemo: string = '';
  productMemo: string = '';
  merchantMemo: string = '';
  masterChildInfo: masterChildInfoInterface[] = [];
  /**
   * If executed "Delete expired child"
   * Child voucher will be marked as "Return expire" in Association Status column in mother voucher details.
   * Then, for the trashed child voucher details, should add below text in Voucher Memo field.
   * 
   */
  showMaskEmail: boolean = true;
  showMaskMobile: boolean = true;

  dummyDistributionConfig = {
    email: 'abc123@xyz.org',
    mobile: '',
    emailStatus: 'Delivered',
    mobileStatus: '',
    canResend: true,
    updateRange: 'one',
  };

  editEmailOrPhoneForm = this.formBuilder.group({
    updateRange: ['one'],
    email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.required]],
    mobile: ['', [Validators.pattern(/^[0-9+]\d*$/), Validators.required]],
  });
  constructor(
    private modalService: NgbModal,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private voucherApiService: VoucherApiService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly router: Router,
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name.toUpperCase();
    const isDirectorder = false;
    this.showDistribution = isDirectorder;
  }

  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.paramMap.get('id');
    this.voucherInfo.guid = idFromUrl ? idFromUrl : '';
    this.distributionConfig = this.dummyDistributionConfig;
    this.editEmailOrPhoneForm.dirty;
    this.getVoucherDetails();
  }

  eyeSwitcher(type: DistributionTypeEnum): void {
    if (type === this.distributionTypeEnum.EMAIL) {
      this.showMaskEmail = !this.showMaskEmail;
    }
    if (type === this.distributionTypeEnum.MOBILE) {
      this.showMaskMobile = !this.showMaskMobile;
    }
  }

  canDeleteRelationship(row: any): boolean {
    const rowStatus = row.voucherStatus;
    switch (this.voucherType) {
      case this.voucherTypeEnum.MOTHER: {
        if(row.capturedCount > 0) { return false; }
        if ((this.voucherInfo.status === this.voucherStatusEnum.ACTIVATED || this.voucherInfo.status === this.voucherStatusEnum.USED)
          && rowStatus === this.voucherStatusEnum.ACTIVATED) {
          return true;
        } else {
          return false;
        }
      }
      case this.voucherTypeEnum.CHILD: {
        if(this.voucherBasicInfo.capturedCount > 0) { return false; }
        if (this.voucherInfo.status === this.voucherStatusEnum.ACTIVATED
          && (rowStatus === this.voucherStatusEnum.ACTIVATED || rowStatus === this.voucherStatusEnum.USED)) {
          return true;
        } else {
          return false;
        }
      }
      default: return false;
    }
  }

  editEmailOrPhone(type: string) {

  }

  getServiceProviderList(type: DistributionTypeEnum) {
    // TODO: replace dummy API
    this.voucherApiService.getServiceProviderList(this.tenant, type).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          this.serviceProviderList = res[0].provider;
        },
        error: (err: any) => { },
      });

  }


  getVoucherDetails() {
    this.voucherApiService.getVoucherDetails(this.voucherInfo.guid).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          const item = data.vouchersByGUIDs.items[0];
          this.setBasicData(item);
          this.setMemos(item);
          this.setMotherChildVoucherInfo(item);
          this.getQuotationDetails(item.orderLineDetail[0]?.orderLine?.order?.clientQuotationId);
          this.voucherInfo.voucherId = item.id;
          this.voucherInfo.voucherNumber = item.voucherNumberMask;
          this.voucherInfo.status = item.stateDescription;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
        complete: () => {
        }
      });
  }


  getQuotationDetails(quotationId: string) {
    this.voucherApiService.getQuotationDetails(this.tenant.toLowerCase(), +quotationId).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = res.Data[0];
          this.voucherBasicInfo.quotaionNo = data?.QuotationNumber;
          this.voucherBasicInfo.projectName = data?.ProjectName;
          this.voucherBasicInfo.businessModel = data?.BusinessModelName;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
        complete: () => {
        }
      });
  }

  setMemos(item: any) {
    const memoData = {
      voucherMemo: item.memo,
      orderMemo: item.orderLineDetail[0]?.orderLine.order.memo,
      clientMemo: item.orderLineDetail[0]?.orderLine.order.client[0]?.memo,
      productMemo: item.orderLineDetail[0]?.orderLine.productVersion[0]?.product.customerServiceNote,
      merchantMemo: item.orderLineDetail[0]?.orderLine.productVersion[0]?.product.contractSKU[0]?.contractSKUCosts[0]?.skuCostContract.merchant.memo,
    }
    this.voucherMemo = memoData.voucherMemo;
    this.orderMemo = memoData.orderMemo;
    this.clientMemo = memoData.clientMemo;
    this.productMemo = memoData.productMemo;
  }

  setBasicData(item: any) {
    this.voucherBasicInfo.clientName = item.orderLineDetail[0]?.orderLine?.order.client[0]?.clientName;
    this.voucherBasicInfo.orderNo = item.orderLineDetail[0].orderLine.order.orderNumber;
    this.voucherBasicInfo.skuName = item.orderLineDetail[0].orderLine.productVersion[0].product.contractSKU[0].skuName;
    this.voucherBasicInfo.skuCode = item.orderLineDetail[0].orderLine.productVersion[0].product.contractSKU[0].skuNumber;
    this.voucherBasicInfo.productType = item.orderLineDetail[0].orderLine.productVersion[0].product.productType;
    this.voucherBasicInfo.publishDate = item.orderLineDetail[0]?.orderLine?.order.publishDateTime;
    this.voucherBasicInfo.activateDate = item.activatedOn;
    this.voucherBasicInfo.expiryDate = item.expiryOn;
    this.voucherBasicInfo.capturedCount = item.capturedCount;
  }

  setMotherChildVoucherInfo(item: any) {
    this.voucherType = this.voucherTypeEnum.NORMAL;
    if (item.combo.length > 0) {
      this.voucherType = this.voucherTypeEnum.MOTHER;
      const list = item.combo.map((e: any) => {
        const motherChildVoucherInfo = {
          voucherId: e.id,
          voucherNumber: e.voucherNumberMask,
          voucherGuid: e.guid?.guid,
          voucherStatus: e.stateDescription,
          productName: e.orderLineDetail[0]?.orderLine?.productVersion[0]?.productName,
          associationStatus: this.associationStatusMapper(e.associationStatus?.id, e.stateDescription),
          faceValue: e.orderLineDetail?.faceValue,
          remainingBalance: e.balance,
          capturedCount: e.capturedCount
        }
        return motherChildVoucherInfo;
      })
      this.masterChildInfo = list;
    }
    if (item.masterVoucherId) {
      this.voucherType = this.voucherTypeEnum.CHILD;
      const list: masterChildInfoInterface[] = [
        {
          voucherNumber: item.master[0]?.voucherNumberMask,
          voucherGuid: item.master[0]?.guid.guid,
          voucherStatus: item.master[0]?.stateDescription,
          productName: item.master[0]?.orderLineDetail[0]?.orderLine?.productVersion[0]?.productName,
        },
      ];
      this.masterChildInfo = list;
    }
  }

  refresh(type: DistributionTypeEnum) {
    // TODO: call refresh API
    if (type === this.distributionTypeEnum.EMAIL && this.distributionConfig.email) {
      this.toast.showSuccess(`You've successfully updated the distribution status.`);
    }
    if (type === this.distributionTypeEnum.MOBILE && this.distributionConfig.mobile) {
      this.toast.showSuccess(`You've successfully updated the distribution status.`);
    }
  }

  openModal(content: TemplateRef<NgbModal>, size = 'md') {
    this.updateMemoContent = this.voucherMemo;
    const modalRef = this.modalService.open(content, { size: size, backdrop: 'static', centered: true });
    modalRef.closed.subscribe(btn => {
      // updateMemo
      if (btn === 'updateMemo') {
        this.updateMemo();
      }
    });
  }

  updateMemo(voucherMemo?: string) {
    const memoRequest = {
      voucherMemos: [
        {
          voucherId: this.voucherInfo.voucherId,
          memo: voucherMemo ? voucherMemo : this.updateMemoContent,
        }
      ]
    };
    this.voucherApiService.updateVoucherMemo(memoRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.showSuccess(`You've successfully updated the memo.`);
        } else {
          this.toast.showDanger(res.message);
        }
      },
      error: (err: any) => {
        this.toast.showDanger(err.error?.data?.errors[0]?.message);
      },
      complete: () => {
        this.getVoucherMemo();
      }
    });
  }

  getVoucherMemo(): void {
    this.voucherApiService.getVoucherMemo(this.voucherInfo.guid).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.data);
        this.voucherMemo = data.vouchersByGUIDs.items[0].memo;
      },
      error: (err: any) => {
        this.toast.showDanger(err.message);
      },
    });
  }

  openModalDeleteRelationship(content: TemplateRef<NgbModal>, row: any) {
    const modalRef = this.modalService.open(content, { size: 'md', backdrop: 'static', centered: true });
    modalRef.closed.subscribe(btn => {
      if (btn) {
        const voucherId = this.voucherType === this.voucherTypeEnum.CHILD ? +this.voucherInfo.voucherId : row.voucherId;
        this.voucherApiService.dissociateChildVoucher(voucherId).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.toast.showSuccess(`You've successfully disassociated the two vouchers.`)
              this.getVoucherDetails();
            } else {
              this.toast.showDanger(res.message);
            }
          },
          error: (err: any) => {
            this.toast.showDanger(`${err.error.data.errors[0]?.errorCode}: ${err.error.data.errors[0]?.message}`);
          },
        });

      }
    });
  }

  openDistributionModal(content: TemplateRef<NgbModal>, size = 'md', type: DistributionTypeEnum): void {
    this.editType = type;
    this.editEmailOrPhoneForm.reset();
    this.editEmailOrPhoneForm.get('updateRange')?.setValue('one');
    if (type === this.distributionTypeEnum.EMAIL) {
      this.editEmailOrPhoneForm.get('email')?.reset();
      this.editEmailOrPhoneForm.get('mobile')?.removeValidators(Validators.required);
    }

    if (type === this.distributionTypeEnum.MOBILE) {
      this.editEmailOrPhoneForm.get('mobile')?.reset();
      this.editEmailOrPhoneForm.get('email')?.removeValidators(Validators.required);
    }

    this.getServiceProviderList(type);
    const modalRef = this.modalService.open(content, { size: size, backdrop: 'static', centered: true });
    modalRef.closed.subscribe(btn => {
      switch (btn) {
        case 'update': {
          if (type === this.distributionTypeEnum.EMAIL) {
            this.distributionConfig.email = this.editEmailOrPhoneForm.get('email')?.value;
          }

          if (type === this.distributionTypeEnum.MOBILE) {
            this.distributionConfig.mobile = this.editEmailOrPhoneForm.get('mobile')?.value;
          }
          this.toast.showSuccess(`You've successfully updated the ${type === this.distributionTypeEnum.EMAIL ? type : 'phone number'}.`);
          break;
        }
        case 'resend': {
          if (type === this.distributionTypeEnum.EMAIL) {
            this.toast.showSuccess(`You've successfully resent the email.`);
          }
          if (type === this.distributionTypeEnum.MOBILE) {
            this.toast.showSuccess(`You've successfully resent the SMS.`);
          }
        }
      }
    });
  }

  /**
   * For voucher status is not Trashed, Association status should be "Associated (id=1)".
   * If the child voucher has been Trashed due to "Association (id=1)", show "Disassociated" in this column.
   * If the child voucher has been Trashed due to "Expired (id=2)", show "Expired return" in this column.
   */
  associationStatusMapper(associationStatusId: string, status: string): AssociationStatusEnum {
    if (status === 'Trashed') {
      return +associationStatusId === 1 ? AssociationStatusEnum.DISASSOCIATED : AssociationStatusEnum.EXPIRED;
    } else {
      return AssociationStatusEnum.ASSOCIATED;
    }
  }

  openOperationHistoryModal() {
    this.modalService.open(OperationHistoryComponent, { size: 'lg', backdrop: 'static', centered: true });
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  navigateToVoucherDetails(item: any): string {
    return `voucher/voucher-details/${item.voucherGuid}`;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  navigateToVoucherHistory(url: string) {
    this.router.navigate([`${url}/${this.voucherInfo.guid}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

export interface masterChildInfoInterface {
  voucherNumber: string;
  voucherGuid: string;
  voucherStatus: VoucherStatusEnum;
  productName: string;
  associationStatus?: string;
  faceValue?: string;
  remainingBalance?: string;
  capturedCount? : string;
}