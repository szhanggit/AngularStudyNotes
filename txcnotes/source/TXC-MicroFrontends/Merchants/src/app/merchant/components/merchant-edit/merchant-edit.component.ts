import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Merchant } from '../../models/merchant.model';
import { MerchantService } from '../../services/merchant.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { GlobalMerchantFormGroup, GlobalRewardsMerchantFormGroup, IndiaMerchantFormGroup, SingaporeMerchantFormGroup, TaiwanMerchantFormGroup } from '../../models/merchant-form-group.model';
import { IDefineFormGroup } from '../../models/define-form-group.model';
import { MerchantAddress } from '../../models/merchant-address.model';

@Component({
  selector: 'app-merchant-edit',
  templateUrl: './merchant-edit.component.html',
  styleUrls: ['./merchant-edit.component.scss']
})

export class MerchantEditComponent implements OnInit {
  merchant!: Merchant | undefined;
  status: number = 0;
  tenant!: string;

  formGroupDefinitions: IDefineFormGroup[] = [
    new TaiwanMerchantFormGroup(),
    new GlobalMerchantFormGroup(),
    new IndiaMerchantFormGroup(),
    new SingaporeMerchantFormGroup(),
    new GlobalRewardsMerchantFormGroup()
  ];

  merchantFormGroup: FormGroup = new FormGroup({});
  constructor(private readonly _route: ActivatedRoute,
    private readonly _merchantService: MerchantService,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');

    this.tenant = this._tenantConfigService.getTenant(tenantFromRoute).name;
    const def = this.formGroupDefinitions.find(f => f.tenantCode === this.tenant)
    if (def) {
      this.merchantFormGroup = def.define(this._formBuilder, true);
    }

    const id = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this._merchantService.getMerchantById(id).subscribe(res => {
      this.merchant = res.data.merchantDetails[0];
      if (this.merchant.address) {
        this.merchant.address = new MerchantAddress(this.merchant.address)
      }
      this.merchant.merchantAcquirerId = this.merchant.merchantAcquireId;

      if (this.tenant !== 'TW') {
        if (this.tenant !== 'SG') {
          delete this.merchant.invoiceRegisterNumber;
        }

        delete this.merchant.tX1MerchantUID;
        delete this.merchant.isAutoCreateReimbursement;
        delete this.merchant.autoCreateReimbursementIntervalType;
        delete this.merchant.reimbursementType;
        delete this.merchant.reimbursementTaxType;
        delete this.merchant.reimbursementReceivers;
        delete this.merchant.merchantAutoType;
        delete this.merchant.autoCreateReimbursementDay;
        delete this.merchant.categoryId;
      }

      delete this.merchant.merchantAcquireId;
      delete this.merchant.merchantAcquireName;
      delete this.merchant.programName;

      const newMcEmailList = [];
      const newEcEmailList = [];

      for (const mcEmailList of this.merchant.merchantContactEmailList) {
        newMcEmailList.push({
          emailAddress: mcEmailList
        });
      }

      for (const ecEmailList of this.merchant.edenredContactEmailList) {
        newEcEmailList.push({
          internalEmailAddress: ecEmailList
        });
      }

      if (newMcEmailList.length === 0) {
        newMcEmailList.push({
          emailAddress: ''
        });
      }

      if (newEcEmailList.length === 0) {
        newEcEmailList.push({
          internalEmailAddress: ''
        });
      }

      this.merchant.merchantContactEmailList = newMcEmailList;
      this.merchant.edenredContactEmailList = newEcEmailList;

      for (const [index, merchantEmail] of this.merchant.merchantContactEmailList.entries()) {
        if (index !== 0) {
          this.addMerchantEmail();
        }
      }

      for (const [index, merchantEmail] of this.merchant.edenredContactEmailList.entries()) {
        if (index !== 0) {
          this.addInternalEmail();
        }
      }

      this.merchantFormGroup.setValue(this.merchant);

      if (this.merchantFormGroup.invalid) {
        Object.keys(this.merchantFormGroup.controls).forEach(key => {
          if (this.merchantFormGroup.controls[key].invalid) {
            this.merchantFormGroup.controls[key].markAsDirty();
          }
        })
      }
    });
  }

  private createMerchantEmail(): FormGroup {
    return new FormGroup({
      'emailAddress': new FormControl('', [Validators.email]),
    });
  }

  public addMerchantEmail() {
    const emails = this.merchantFormGroup.get('merchantContactEmailList') as FormArray
    emails.push(this.createMerchantEmail())
  }

  public removeMerchantEmail(i: number) {
    const emails = this.merchantFormGroup.get('merchantContactEmailList') as FormArray
    if (emails.length > 1) {
      emails.removeAt(i)
    } else {
      emails.reset()
    }
  }

  private createInternalEmail(): FormGroup {
    return new FormGroup({
      'internalEmailAddress': new FormControl('', Validators.email),
    });
  }

  public addInternalEmail() {
    const emails = this.merchantFormGroup.get('edenredContactEmailList') as FormArray
    emails.push(this.createInternalEmail())
  }

  public removeInternalEmail(i: number) {
    const emails = this.merchantFormGroup.get('edenredContactEmailList') as FormArray
    if (emails.length > 1) {
      emails.removeAt(i)
    } else {
      emails.reset()
    }
  }
}
