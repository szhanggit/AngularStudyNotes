import { TemplateRef } from "@angular/core";
import { NgbdToastGlobal } from "@txc-angular/component-library";
import { VoucherNumberRuleListComponent } from "../components/voucher-number-rule/voucher-number-rule-list/voucher-number-rule-list.component";

export interface IDetailsToastDefinition {
    action: string;
    cancelled: boolean;
    message: string;

    getMessageToast(): any;
}

export class BaseMerchantGroupDetailsToast {
    constructor(
        protected readonly toast: NgbdToastGlobal,
    ) {
    }
}

export class BaseVnrToast extends BaseMerchantGroupDetailsToast {
    constructor(
        toast: NgbdToastGlobal, 
        protected readonly vnrListComponent: VoucherNumberRuleListComponent, 
    ) {
        super(toast);
        this.vnrListComponent = vnrListComponent;
    }
}

export class VnrCreatedToast extends BaseVnrToast implements IDetailsToastDefinition {
    action = 'vnrCreated';
    cancelled = false;
    message = 'Voucher number rule created successfully';

    getMessageToast(): any {
        const ref = this.toast.showSuccess(this.message);
        // TODO: TXC/S34/ - should be group vnr list component
        // this.vnrListComponent.collapse();

        return ref;
    }
}

export class VnrUpdatedToast extends BaseVnrToast implements IDetailsToastDefinition {
    action = 'vnrUpdated';
    cancelled = false;
    message = 'Voucher number rule updated successfully';

    getMessageToast(): any {
        const ref = this.toast.showSuccess(this.message);
        // TODO: TXC/S34/ - should be group vnr list component
        // this.vnrListComponent.collapse();

        return ref;
    }
}

export class VnrCancelledToast extends BaseVnrToast implements IDetailsToastDefinition {
    action = 'vnrCancelled';
    cancelled = true;
    message = '';

    getMessageToast(): any {
    }
}