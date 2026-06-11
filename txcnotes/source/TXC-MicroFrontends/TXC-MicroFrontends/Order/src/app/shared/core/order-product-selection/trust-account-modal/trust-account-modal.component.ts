import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { skip } from 'rxjs';
import { BusinessUnitEnum } from 'src/app/shared/enums/tenant.enum';
import { Product } from 'src/app/shared/models/product.model';
import { TrustAccountService } from 'src/app/order/services/trust-account.service';
import { BaseResponse } from 'src/app/order/models/base-response.model';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { orderLineTrustAccount } from 'src/app/shared/models/trust-account.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-trust-account-modal',
  templateUrl: './trust-account-modal.component.html',
  styleUrls: ['./trust-account-modal.component.scss'],
})
export class TrustAccountModalComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  product!: Product;
  trustAccountFormGroup!: FormGroup;
  selectedTenant!: string;
  disableEditOnTrustAccount = false;
  editMode!: boolean;
  destroy$ = new Subject();
  isViewOnlyTrustAccount = false;

  get tenantEnum(): typeof BusinessUnitEnum {
    return BusinessUnitEnum;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private trustAccountSvc: TrustAccountService
  ) {}

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');

    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }
    this.initializeForm();
    this.fetchViewTrustAccount();
  }

  private initializeForm() {
    this.trustAccountFormGroup = this.formBuilder.group({
      isTrustAccountNeeded: new FormControl({
        value: this.product.trustAccount?.isTrustAccountNeeded,
        disabled: this.disableEditOnTrustAccount,
      }),
      trustAccount: new FormControl({
        value: this.product.trustAccount?.trustAccount,
        disabled: this.disableEditOnTrustAccount,
      }),
      trustAccountBank: new FormControl({
        value: this.product.trustAccount?.trustAccountBank,
        disabled: true,
      }),
      trustAccountFee: new FormControl({
        value: this.product.trustAccount?.trustAccountFee,
        disabled: true,
      }),
      trustAccountBatchNumber: new FormControl({
        value: this.product.trustAccount?.trustAccountBatchNumber,
        disabled: true,
      }),
      trustAccountOption: new FormControl({
        value: this.product.trustAccount?.trustAccountOption,
        disabled: this.disableEditOnTrustAccount,
      }),
      trustAmount: new FormControl(
        {
          value: this.product.trustAccount?.trustAmount,
          disabled: this.disableEditOnTrustAccount,
        },
        [Validators.required, Validators.pattern(/^[0-9]*(\.[0-9]{0,2})?$/)]
      ),
      trustExpiryScheme: new FormControl({
        value: this.product.trustAccount?.trustExpiryScheme,
        disabled: this.disableEditOnTrustAccount,
      }),
      trustExpiryDate: new FormControl(
        {
          value: new Date(
            this.product.trustAccount?.trustExpiryDate
              ? this.product.trustAccount?.trustExpiryDate
              : ''
          ),
          disabled: true,
        },
        Validators.required
      ),
      validPeriod: new FormControl({
        value: [
          new Date(
            this.product.trustAccount?.validPeriod
              ? this.product.trustAccount?.validPeriod[0]
              : ''
          ),
          new Date(
            this.product.trustAccount?.validPeriod
              ? this.product.trustAccount?.validPeriod[1]
              : ''
          ),
        ],
        disabled: true,
      }),
    });

    this.registerEditTrustAccountLogic();
  }

  registerEditTrustAccountLogic() {
    const trustAccountOption =
      this.trustAccountFormGroup.get('trustAccountOption');
    const trustAmount = this.trustAccountFormGroup.get('trustAmount');

    // BUGFIX: 33135
    // disable/enable trust amount field on first load
    if (
      trustAccountOption!.value === 'Default' ||
      this.disableEditOnTrustAccount
    ) {
      trustAmount?.disable();
    } else {
      trustAmount?.enable();
    }

    trustAccountOption?.valueChanges
      .pipe(
        skip(this.editMode && trustAccountOption?.value === 'Custom' ? 1 : 0)
      )
      .subscribe((value) => {
        const product = this.product?.trustAccount;
        trustAmount?.patchValue(product?.trustAmount);
        if (value === 'Default') {
          trustAmount?.markAsPristine();
        } else if (value === 'Custom') {
          trustAmount?.patchValue(null);
        }
      });
  }

  onButtonClicked(save = false) {
    if (save) {
      this.product.trustAccount = this.trustAccountFormGroup.getRawValue();
    }

    this.activeModal.dismiss(save);
  }

  fetchViewTrustAccount() {
    if (this.isViewOnlyTrustAccount) {
      this.disableEditOnTrustAccount = true;
      this.trustAccountSvc
        .getTrustAccount(this.product?.orderLineId!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (trustAccount: orderLineTrustAccount) => {
            if (trustAccount) {
              this.maporderLineTrustToTrustForm(trustAccount);
            } else {
              this.toast.showDanger('No record present for trust account.');
            }
          },
          error: () => {
            this.toast.showDanger(
              'Error while fetching trust account data. Please try again later.'
            );
          },
        });
    }
  }

  maporderLineTrustToTrustForm(orderLineTrustData: orderLineTrustAccount) {
    this.trustAccountFormGroup.patchValue({
      isTrustAccountNeeded: orderLineTrustData.isTrustAccountNeeded ?? true,
      trustAccount: orderLineTrustData.trustAccountId,
      trustAccountFee: orderLineTrustData.Fee ?? '',
      trustAccountBatchNumber: orderLineTrustData.trustAccountBatchNo,
      trustAccountOption:
        orderLineTrustData.trustAccountOption == 1 ? 'Custom' : 'Default',
      trustAmount: orderLineTrustData.amount,
      trustExpiryDate: orderLineTrustData.expiryDate,
      trustExpiryScheme:
        orderLineTrustData.trustExpiryScheme ??
        orderLineTrustData.expiryPolicyId,
      validPeriod: [orderLineTrustData.validFrom, orderLineTrustData.validTo],
    });
    this.registerEditTrustAccountLogic();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
