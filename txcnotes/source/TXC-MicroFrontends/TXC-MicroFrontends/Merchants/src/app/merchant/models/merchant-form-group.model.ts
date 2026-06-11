import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NumberValidator } from "../validators/number.validator";
import { PhoneNumberValidator } from "../validators/phone-number.validator";
import { IDefineFormGroup } from "./define-form-group.model";
import { UENNumberValidator } from "../validators/uen.validator";

abstract class BaseDefinitionMerchantFormGroup {
    protected createMerchantEmail(): FormGroup {
        return new FormGroup({
            'emailAddress': new FormControl('', [Validators.email]),
        });
    }

    protected createInternalEmail(): FormGroup {
        return new FormGroup({
            'internalEmailAddress': new FormControl('', Validators.email),
        });
    }

    protected commonDef(_formBuilder: FormBuilder, isEdit: boolean): FormGroup {
        const result = _formBuilder.group({
            status: new FormControl({ value: 1, disabled: false }),
            merchantName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
            programId: new FormControl({ value: '', disabled: isEdit }, [Validators.required]),
            issuerType: new FormControl({ value: '', disabled: false }, [Validators.required]),
            externalCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]),
            identityCode: new FormControl({ value: '', disabled: true }),
            description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),

            securityKey: new FormControl({ value: '', disabled: true }),
            sameKeyWithShop: new FormControl({ value: false, disabled: false }, [Validators.maxLength(1000)]),
            notificationMerchantCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),

            address: new FormGroup({
                countryId: new FormControl({ value: 0, disabled: false }),
                stateOrProvinceId: new FormControl({ value: 0, disabled: true }),
                cityId: new FormControl({ value: 0, disabled: true }),
                district: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
                detailAddressLine: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
                postcode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            }),

            merchantEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email, Validators.maxLength(255)]),
            mainContact: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),
            mainPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50), ]),
            merchantContactEmailList: _formBuilder.array([this.createMerchantEmail()]),

            mamEmail: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(255), Validators.email]),
            edenredContactEmailList: _formBuilder.array([this.createInternalEmail()])
        });

        if (isEdit) {
            const editDefControls = this.editDef(_formBuilder).controls;
            Object.keys(editDefControls).forEach(key => {
                result.addControl(key, editDefControls[key]);
            });
        }

        return result;
    }

    protected editDef(_formBuilder: FormBuilder): FormGroup {
        const result = _formBuilder.group({
            merchantId: new FormControl({ value: 0 }),
            merchantAcquirerId: new FormControl({ value: 1, disabled: false }, [Validators.required, Validators.maxLength(500)]),
            needConsumerScan: new FormControl({ value: false, disabled: false }),
            programCode: new FormControl({ value: 0 }),
            workKeyId: new FormControl({ value: 0 }),
            workKey: new FormControl({ value: '' }),
            workKeyExpireTime: new FormControl({ value: '' }),
            workKeyCreatedTime: new FormControl({ value: '' }),
            isLegacyMerchant: new FormControl({ value: false }),
            memo: new FormControl({ value: '' }, [Validators.maxLength(2000)])
        });
        return result;
    }
}

export class TaiwanMerchantFormGroup extends BaseDefinitionMerchantFormGroup implements IDefineFormGroup {
    tenantCode: string = "TW";
    define(_formBuilder: FormBuilder, isEdit = false): FormGroup {
        const result = _formBuilder.group({
            categoryId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            tX1MerchantUID: new FormControl({ value: '', disabled: false }, [Validators.maxLength(200)]),

            invoiceRegisterNumber: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100), NumberValidator.isValidNumber()]),
            reimbursementTaxType: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(200)]),
            autoCreateReimbursementIntervalType: new FormControl({ value: 0, disabled: false }, [Validators.maxLength(200)]),
            autoCreateReimbursementDay: new FormControl({ value: null, disabled: false }),
            reimbursementType: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(1000)]),
            isAutoCreateReimbursement: new FormControl({ value: false, disabled: false }, [Validators.maxLength(200)]),
            reimbursementReceivers: new FormControl({ value: '', disabled: false }, [Validators.maxLength(1000)]),
            merchantAutoType: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(1000)]),
        });

        const commonDefControls = this.commonDef(_formBuilder, isEdit).controls;
        Object.keys(commonDefControls).forEach(key => {
            result.addControl(key, commonDefControls[key]);
        });

        return result;
    }
}

export class GlobalMerchantFormGroup extends BaseDefinitionMerchantFormGroup implements IDefineFormGroup {
    tenantCode: string = "GL";
    define(_formBuilder: FormBuilder, isEdit = false): FormGroup {
        const result: FormGroup = _formBuilder.group({
            merchantAcquirerId: new FormControl({ value: '', disabled: isEdit }, [Validators.required, Validators.maxLength(500)]),
            needConsumerScan: new FormControl({ value: false, disabled: false }),
        });

        const commonDefControls = this.commonDef(_formBuilder, isEdit).controls;
        Object.keys(commonDefControls).forEach(key => {
            result.addControl(key, commonDefControls[key]);
        });

        return result;
    }

}

export class IndiaMerchantFormGroup extends BaseDefinitionMerchantFormGroup implements IDefineFormGroup {
    tenantCode: string = "IN";
    define(_formBuilder: FormBuilder, isEdit = false): FormGroup {
        const result = _formBuilder.group({
            //details
            needConsumerScan: new FormControl({ value: false, disabled: false }),
        });

        const commonDefControls = this.commonDef(_formBuilder, isEdit).controls;
        Object.keys(commonDefControls).forEach(key => {
            result.addControl(key, commonDefControls[key]);
        });

        return result;
    }
}

export class SingaporeMerchantFormGroup extends BaseDefinitionMerchantFormGroup implements IDefineFormGroup {
    tenantCode: string = "SG";
    define(_formBuilder: FormBuilder, isEdit = false): FormGroup {
        const result = _formBuilder.group({
            needConsumerScan: new FormControl({ value: false, disabled: false }),
            invoiceRegisterNumber: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100), UENNumberValidator.isValidUENNumber()]),
        });

        const commonDefControls = this.commonDef(_formBuilder, isEdit).controls;
        Object.keys(commonDefControls).forEach(key => {
            result.addControl(key, commonDefControls[key]);
        });

        return result;
    }
}

export class GlobalRewardsMerchantFormGroup extends BaseDefinitionMerchantFormGroup implements IDefineFormGroup {
    tenantCode: string = "GR";
    define(_formBuilder: FormBuilder, isEdit = false): FormGroup {
        const result = _formBuilder.group({
            needConsumerScan: new FormControl({ value: false, disabled: false}),
        });

        const commonDefControls = this.commonDef(_formBuilder, isEdit).controls;
        Object.keys(commonDefControls).forEach(key => {
            result.addControl(key, commonDefControls[key]);
        });

        return result;
    }
}