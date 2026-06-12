import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductType } from "../product-type.model";

export interface IBUFormGroup {
    formGroup: FormGroup;
    setValues(x: any): void;
    validate(x?: any): boolean;
    disableFieldsForEditMode(): void;
}

export class MasterProductBUFormGroupFactory {
    formBuidler: FormBuilder
    constructor(formBuilder: FormBuilder) {
        this.formBuidler = formBuilder;
    }
    getBUFormGroup(tenantCode: string, productType: ProductType): IBUFormGroup {
        // Smart choice voucher
        if (productType.key === 5) {
            switch (tenantCode) {
                case 'GL':
                    return new GlobalMasterProductDetailsBUFormGroup(this.formBuidler);
                default:
                    return new GeneralMasterProductDetailsBUFormGroup(this.formBuidler);
            }
        }
        // Super voucher
        else if (productType.key === 8) {
            switch (tenantCode) {
                case 'GL':
                    return new GlobalMasterProductDetailsBUFormGroup(this.formBuidler);
                case 'IN':
                    return new IndiaSuperVoucherDetailsBUFormGroup(this.formBuidler);
                default:
                    return new GeneralMasterProductDetailsBUFormGroup(this.formBuidler);
            }
        }

        return new GeneralMasterProductDetailsBUFormGroup(this.formBuidler);
    }
}

// base class for master product details form group
abstract class MasterProductDetailsBUFormGroupBase {
    // common definitions for master product details form group
    protected commonDef(formBuilder: FormBuilder): FormGroup {
        return formBuilder.group({
            // basic info
            productName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(200)]),
            productCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]),
            productDescription: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
            // additional info
            operationNote: new FormControl({ value: '', disabled: false }, [Validators.maxLength(2000)]),
            salesNote: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
            customerServiceNote: new FormControl({ value: '', disabled: false }, [Validators.maxLength(2000)]),
        });
    }
}

export class GeneralMasterProductDetailsBUFormGroup extends MasterProductDetailsBUFormGroupBase implements IBUFormGroup {
    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder) {
        super();
        this.formGroup = super.commonDef(formBuilder);
    }

    setValues(x: any): void {
        if (x == null) return;
        this.formGroup.get('productName')?.setValue(x.productName);
        this.formGroup.get('productCode')?.setValue(x.productCode);
        this.formGroup.get('productDescription')?.setValue(x.productDescription ?? x.description);
        this.formGroup.get('description')?.setValue(x.productDescription ?? x.description);
        this.formGroup.get('operationNote')?.setValue(x.operationNote);
        this.formGroup.get('salesNote')?.setValue(x.salesNote);
        this.formGroup.get('customerServiceNote')?.setValue(x.customerServiceNote);
    }

    validate(): boolean {
        this.formGroup.updateValueAndValidity();
        return this.formGroup.valid;
    }

    disableFieldsForEditMode(): void {
        this.formGroup.get('productCode')?.disable();
    }
}

export class GlobalMasterProductDetailsBUFormGroup extends MasterProductDetailsBUFormGroupBase implements IBUFormGroup {
    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder) {
        super();
        this.formGroup = super.commonDef(formBuilder);
        // basic info
        this.formGroup.addControl('voucherIssuerId', new FormControl({ value: '', disabled: false }, [Validators.required]));
    }

    setValues(x: any): void {
        if (x == null) return;
        this.formGroup.get('productName')?.setValue(x.productName);
        this.formGroup.get('productCode')?.setValue(x.productCode);
        this.formGroup.get('productDescription')?.setValue(x.productDescription ?? x.description);
        this.formGroup.get('description')?.setValue(x.productDescription ?? x.description);
        this.formGroup.get('voucherIssuerId')?.setValue(x.voucherIssuerId);
        this.formGroup.get('operationNote')?.setValue(x.operationNote);
        this.formGroup.get('salesNote')?.setValue(x.salesNote);
        this.formGroup.get('customerServiceNote')?.setValue(x.customerServiceNote);
    }

    validate(): boolean {
        this.formGroup.updateValueAndValidity();
        return this.formGroup.valid;
    }

    disableFieldsForEditMode(): void {
        this.formGroup.get('productCode')?.disable();
        this.formGroup.get('voucherIssuerId')?.disable();
    }
}

export class IndiaSuperVoucherDetailsBUFormGroup extends MasterProductDetailsBUFormGroupBase implements IBUFormGroup {
    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder) {
        super();
        this.formGroup = super.commonDef(formBuilder);
        // basic info
        this.formGroup.addControl('superVoucherType', new FormControl({ value: 0, disabled: false }, [Validators.required]));
    }

    setValues(x: any): void {
        if (x == null) return;
        this.formGroup.get('productName')?.setValue(x.productName);
        this.formGroup.get('productCode')?.setValue(x.productCode);
        this.formGroup.get('productDescription')?.setValue(x.productDescription ?? x.description);
        this.formGroup.get('description')?.setValue(x.productDescription ?? x.description);
        this.formGroup.get('operationNote')?.setValue(x.operationNote);
        this.formGroup.get('salesNote')?.setValue(x.salesNote);
        this.formGroup.get('customerServiceNote')?.setValue(x.customerServiceNote);

        let superVoucherType = this.getSuperVoucherTypeSelectionValue(x.isDeferredChild, x.isCartVersion);
        this.formGroup.get('superVoucherType')?.setValue(superVoucherType);
    }

    validate(): boolean {
        this.formGroup.updateValueAndValidity();
        return this.formGroup.valid;
    }

    disableFieldsForEditMode(): void {
        this.formGroup.get('productCode')?.disable();
        this.formGroup.get('superVoucherType')?.disable();
    }

    private getSuperVoucherTypeSelectionValue(isDeferredChild: boolean, isCartVersion: boolean): number {
        return (isDeferredChild ? 2 : 0) | (isCartVersion ? 1 : 0);
    }
}