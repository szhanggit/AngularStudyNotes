import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PRODUCT_CONSTANTS } from 'src/app/pages/products/constants/product-constants';
import { MERCHANT_CONSTANTS } from '../../constants/merchants.constant';
import { MerchantService } from '../../services/merchant.service';
import { SecurityKeyService } from '../../services/security-key.service';

@Component({
  selector: 'app-create-merchant',
  templateUrl: './create-merchant.component.html',
  styleUrls: ['./create-merchant.component.scss']
})
export class CreateMerchantComponent implements OnInit {
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
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService) {
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    this.tenant = tenantFromRoute ? tenantFromRoute : 'TW';

    this.numbers = Array(31).fill(0).map((x, i) => i);

    switch (this.tenant.toUpperCase()) {
      case 'IN':
        this.merchantFormGroup = this._formBuilder.group({
          //details
          status: new FormControl({ value: 0, disabled: false }),
          name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          internalCode: new FormControl({ value: '', disabled: true }),
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
          //details
          status: new FormControl({ value: 0, disabled: false }),
          name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          merchantAcquirerId: new FormControl({ value: 1, disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          internalCode: new FormControl({ value: '', disabled: true }),
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
          //details
          status: new FormControl({ value: 0, disabled: false }),
          name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          internalCode: new FormControl({ value: '', disabled: true }),
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
          //details
          status: new FormControl({ value: 0, disabled: false }),
          name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          internalCode: new FormControl({ value: '', disabled: true }),
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
          //details
          status: new FormControl({ value: 0, disabled: false }),
          name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
          programId: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          issuerType: new FormControl({ value: 0, disabled: false }, [Validators.required]),
          externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
          internalCode: new FormControl({ value: '', disabled: true }),
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

    this.generateSecurityKey();
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

  generateSecurityKey() {
    this.f.securityKey.setValue(this._securityKeyService.generateSecurityKey(31));
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
      for (const [index, merchantContactEmail] of body.merchant.merchantContactEmailList.entries()) {
        body.merchant.merchantContactEmailList[index] = merchantContactEmail.emailAddress;
      }
      for (const [index, edenredContactEmail] of body.merchant.edenredContactEmailList.entries()) {
        body.merchant.edenredContactEmailList[index] = edenredContactEmail.internalEmailAddress;
      }

      this._merchantService.createMerchant(body).subscribe(res => {
        this.backToList('add');
      });
    }
  }

  backToList(action?: string): void {
    if (action && action === 'add') {
      this._router.navigate(['merchant-list/'],
      {
        queryParams: {
          tenantName: 'TW',
        },
        state: {
          action: 'created',
          merchantName: this.f.name.value
        }
      });
    } else {
      this._router.navigate(['merchant-list/'],
      {
        queryParams: {
          tenantName: 'TW',
        }
      });
    }
    
  }
}
