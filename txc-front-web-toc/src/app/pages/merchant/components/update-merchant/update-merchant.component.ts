import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PRODUCT_CONSTANTS } from 'src/app/pages/products/constants/product-constants';
import { Merchant } from '../../models/merchant.model';
import { MERCHANT_CONSTANTS } from '../../constants/merchants.constant';
import { MerchantService } from '../../services/merchant.service';

@Component({
  selector: 'app-update-merchant',
  templateUrl: './update-merchant.component.html',
  styleUrls: ['./update-merchant.component.scss']
})
export class UpdateMerchantComponent implements OnInit {
  originalMerchant!: Merchant;
  merchant!: Merchant;
  status: number = 0;
  tenant!: string;
  merchantFormGroup: FormGroup;

  // TODO: Get this value using dictionary API
  programs = [{
    key: 0,
    value: 'TicketExpress 2.0'
  }, {
    key: 1,
    value: 'TXC'
  }];

  categories = [{
    key: 0,
    value: 'Category'
  }];

  productIssuers = MERCHANT_CONSTANTS.ISSUER_TYPE;
  taxTypes = MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE;
  settlementFrequencies = MERCHANT_CONSTANTS.AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE;
  reimbursementTypes = MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE;
  merchantAutoTypes = MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE;
  merchantAcquirers = PRODUCT_CONSTANTS.MERCHANT_ACQUIRER;
  numbers: Array<number> = [];

  // form
  get f(): any {
    return this.merchantFormGroup.controls;
  }

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _merchantService: MerchantService,
    private readonly _router: Router) {
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');

    this.tenant = tenantFromRoute ? tenantFromRoute : 'TW';
    const id = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.numbers = Array(31).fill(0).map((x, i) => i);

    switch (this.tenant.toUpperCase()) {
      case 'IN':
        this.merchantFormGroup = this._formBuilder.group({
          merchantId: new FormControl({ value: 0 }),
          programCode: new FormControl({ value: 0 }),
          merchantAcquirerId: new FormControl({ value: 0 }),
          memo: new FormControl({ value: '' }),
          workKeyId: new FormControl({ value: 0 }),
          workKey: new FormControl({ value: '' }),
          workKeyExpireTime: new FormControl({ value: '' }),
          workKeyCreatedTime: new FormControl({ value: '' }),
          isLegacyMerchant: new FormControl({ value: false }),
          //details
          status: new FormControl({ value: 0, disabled: false }),
          merchantName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: true }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          identityCode: new FormControl({ value: '', disabled: true }),
          description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
          needConsumerScan: new FormControl({ value: false, disabled: false }),

          //system & others
          securityKey: new FormControl({ value: '1234567898765432', disabled: true }),
          sameKeyWithShop: new FormControl({ value: false, disabled: false }, [Validators.maxLength(1000)]),
          notificationMerchantCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),

          //merchant contact info
          merchantAddress: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          merchantEmail: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          mainContact: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          mainPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          merchantContactEmailList: this._formBuilder.array([this.createMerchantEmail()]),

          //edenred internal contact info
          mamEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(255), Validators.email]),
          edenredContactEmailList: this._formBuilder.array([this.createInternalEmail()])
        });

        break;
      case 'GL':
        this.merchantFormGroup = this._formBuilder.group({
          merchantId: new FormControl({ value: 0 }),
          programCode: new FormControl({ value: 0 }),
          memo: new FormControl({ value: '' }),
          workKeyId: new FormControl({ value: 0 }),
          workKey: new FormControl({ value: '' }),
          workKeyExpireTime: new FormControl({ value: '' }),
          workKeyCreatedTime: new FormControl({ value: '' }),
          isLegacyMerchant: new FormControl({ value: false }),
          //details
          status: new FormControl({ value: 0, disabled: false }),
          merchantName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          merchantAcquirerId: new FormControl({ value: 1, disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: true }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          identityCode: new FormControl({ value: '', disabled: true }),
          description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
          needConsumerScan: new FormControl({ value: false, disabled: false }),

          //system & others
          securityKey: new FormControl({ value: '1234567898765432', disabled: true }),
          sameKeyWithShop: new FormControl({ value: false, disabled: false }, [Validators.maxLength(1000)]),
          notificationMerchantCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),

          //merchant contact info
          merchantAddress: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          merchantEmail: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          mainContact: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          mainPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          merchantContactEmailList: this._formBuilder.array([this.createMerchantEmail()]),

          //edenred internal contact info
          mamEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(255), Validators.email]),
          edenredContactEmailList: this._formBuilder.array([this.createInternalEmail()])
        });
        break;
      case 'SG':
        this.merchantFormGroup = this._formBuilder.group({
          merchantId: new FormControl({ value: 0 }),
          programCode: new FormControl({ value: 0 }),
          merchantAcquirerId: new FormControl({ value: 0 }),
          memo: new FormControl({ value: '' }),
          workKeyId: new FormControl({ value: 0 }),
          workKey: new FormControl({ value: '' }),
          workKeyExpireTime: new FormControl({ value: '' }),
          workKeyCreatedTime: new FormControl({ value: '' }),
          isLegacyMerchant: new FormControl({ value: false }),
          //details
          status: new FormControl({ value: 0, disabled: false }),
          merchantName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: true }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          identityCode: new FormControl({ value: '', disabled: true }),
          description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
          categoryId: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          needConsumerScan: new FormControl({ value: false, disabled: false }),
          invoiceRegisterNumber: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),

          //system & others
          securityKey: new FormControl({ value: '1234567898765432', disabled: true }),
          sameKeyWithShop: new FormControl({ value: false, disabled: false }, [Validators.maxLength(1000)]),
          notificationMerchantCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),

          //merchant contact info
          merchantAddress: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          merchantEmail: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          mainContact: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          mainPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          merchantContactEmailList: this._formBuilder.array([this.createMerchantEmail()]),

          //edenred internal contact info
          mamEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(255), Validators.email]),
          edenredContactEmailList: this._formBuilder.array([this.createInternalEmail()])
        });
        break;
      case 'GR':
        this.merchantFormGroup = this._formBuilder.group({
          merchantId: new FormControl({ value: 0 }),
          programCode: new FormControl({ value: 0 }),
          merchantAcquirerId: new FormControl({ value: 0 }),
          needConsumerScan: new FormControl({ value: false }),
          memo: new FormControl({ value: '' }),
          workKeyId: new FormControl({ value: 0 }),
          workKey: new FormControl({ value: '' }),
          workKeyExpireTime: new FormControl({ value: '' }),
          workKeyCreatedTime: new FormControl({ value: '' }),
          isLegacyMerchant: new FormControl({ value: false }),
          //details
          status: new FormControl({ value: 0, disabled: false }),
          merchantName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: true }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          identityCode: new FormControl({ value: '', disabled: true }),
          description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),

          //system & others
          securityKey: new FormControl({ value: '1234567898765432', disabled: true }),
          sameKeyWithShop: new FormControl({ value: false, disabled: false }, [Validators.maxLength(1000)]),
          notificationMerchantCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),

          //merchant contact info
          merchantAddress: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          merchantEmail: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          mainContact: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          mainPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          merchantContactEmailList: this._formBuilder.array([this.createMerchantEmail()]),

          //edenred internal contact info
          mamEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(255), Validators.email]),
          edenredContactEmailList: this._formBuilder.array([this.createInternalEmail()])
        });
        break;
      default:
        this.merchantFormGroup = this._formBuilder.group({
          merchantId: new FormControl({ value: 0 }),
          programCode: new FormControl({ value: 0 }),
          merchantAcquirerId: new FormControl({ value: 0 }),
          needConsumerScan: new FormControl({ value: false }),
          memo: new FormControl({ value: '' }),
          workKeyId: new FormControl({ value: 0 }),
          workKey: new FormControl({ value: '' }),
          workKeyExpireTime: new FormControl({ value: '' }),
          workKeyCreatedTime: new FormControl({ value: '' }),
          isLegacyMerchant: new FormControl({ value: false }),
          //details
          status: new FormControl({ value: 0, disabled: false }),
          merchantName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: true }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          identityCode: new FormControl({ value: '', disabled: true }),
          description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
          categoryId: new FormControl({ value: 0, disabled: false }, [Validators.required]),

          //reimbursement
          invoiceRegisterNumber: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          isAutoCreateReimbursement: new FormControl({ value: false, disabled: false }, [Validators.maxLength(200)]),
          autoCreateReimbursementIntervalType: new FormControl({ value: 0, disabled: false }, [Validators.maxLength(200)]),
          reimbursementTaxType: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.maxLength(200)]),
          reimbursementReceivers: new FormControl({ value: '', disabled: false }, [Validators.maxLength(1000)]),
          reimbursementType: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.maxLength(1000)]),
          merchantAutoType: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.maxLength(1000)]),
          autoCreateReimbursementDay: new FormControl({ value: 0, disabled: false }),

          //system & others
          securityKey: new FormControl({ value: '1234567898765432', disabled: true }),
          sameKeyWithShop: new FormControl({ value: false, disabled: false }, [Validators.maxLength(1000)]),
          notificationMerchantCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),
          tX1MerchantUID: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),

          //merchant contact info
          merchantAddress: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          merchantEmail: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
          mainContact: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          mainPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
          merchantContactEmailList: this._formBuilder.array([this.createMerchantEmail()]),

          //edenred internal contact info
          mamEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(255), Validators.email]),
          edenredContactEmailList: this._formBuilder.array([this.createInternalEmail()])
        });
    }

    this._merchantService.getMerchantById(id).subscribe(res => {
      this.merchant = res.data.merchantDetails[0];
      this.merchant.merchantAddress = this.merchant.address.detailAddressLine;
      this.merchant.merchantAcquirerId = this.merchant.merchantAcquireId;

      delete this.merchant.address;
      delete this.merchant.merchantAcquireId;

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
    });
  }

  ngOnInit(): void {
  }

  private createMerchantEmail(): FormGroup {
    return new FormGroup({
      'emailAddress': new FormControl('', [Validators.required, Validators.email]),
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

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  OnSubmit(): void {
    if (this.merchantFormGroup.valid) {
      const body = { merchant: this.merchantFormGroup.getRawValue(), address: { detailAddressLine: this.f.merchantAddress.value } };
      body.merchant.id = body.merchant.merchantId;
      body.merchant.name = body.merchant.merchantName;
      body.merchant.modifier = 'modifier';

      for (const [index, merchantContactEmail] of body.merchant.merchantContactEmailList.entries()) {
        body.merchant.merchantContactEmailList[index] = merchantContactEmail.emailAddress;
      }
      for (const [index, edenredContactEmail] of body.merchant.edenredContactEmailList.entries()) {
        body.merchant.edenredContactEmailList[index] = edenredContactEmail.internalEmailAddress;
      }

      delete body.merchant.identityCode;
      delete body.merchant.merchantId;
      delete body.merchant.merchantName;
      delete body.merchant.programCode;
      delete body.merchant.programId;
      delete body.merchant.merchantAddress;
      delete body.merchant.workKey;
      delete body.merchant.workKeyCreatedTime;
      delete body.merchant.workKeyExpireTime;
      delete body.merchant.workKeyId;

      this._merchantService.updateMerchant(body).subscribe(res => {
        this.navigateToMerchantDetails(res.success);
      });
    }
  }

  backToList(): void {
    this._router.navigate(['merchant-list/'],
      {
        queryParams: {
          tenantName: 'TW',
        }
      });
  }

  navigateToMerchantDetails(edited: boolean) {
    if (edited) {
      this._router.navigate(['merchant-list/details'],
        {
          queryParams: {
            tenantName: 'TW',
            merchantId: this.merchant.merchantId
          },
          state: {
            action: 'updated',
            merchantName: this.f.merchantName.value
          }
        });
    } else {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchant.merchantId
        },
        state: {
          merchant: this.originalMerchant
        }
      });
    }
  }
}
