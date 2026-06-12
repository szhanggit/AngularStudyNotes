import { NgbdToastGlobal } from "@txc-angular/component-library";
import { ShopListComponent } from "../components/shops/shop-list/shop-list.component";
import { VoucherNumberRuleListComponent } from "../components/voucher-number-rule/voucher-number-rule-list/voucher-number-rule-list.component";

export interface IMerchantDetailsToastDefinition {
    action: string;
    cancelled: boolean;
    merchantDetailsCollapsed: boolean;
    getMessageToast(): void;
}

export class BaseMerchantDetailsToast {
    shopList: ShopListComponent;
    ruleList: VoucherNumberRuleListComponent;
    toast: NgbdToastGlobal;
    merchantDetailsCollapsed: boolean = true;
    ruleName: string;
    shopName: string;
    contractName : string;
    merchantName: string;

    constructor(toast: NgbdToastGlobal, shopList: ShopListComponent, ruleList: VoucherNumberRuleListComponent,
        merchantName: string, ruleName: string, shopName: string, contractName: string) {
        this.toast = toast;
        this.shopList = shopList;
        this.ruleList = ruleList;
        this.merchantName = merchantName;
        this.ruleName = ruleName;
        this.shopName = shopName;
        this.contractName = contractName;
    }
}

export class MerchantUpdatedToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'merchantUpdated';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Successfully updated merchant ${this.merchantName}`);
        this.merchantDetailsCollapsed = false;
    }
}

export class MerchantUpdateCancelled extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'merchantUpdateCancelled';
    cancelled = false;

    getMessageToast(): void {
        this.merchantDetailsCollapsed = false;
    }
}

export class BatchUploadShopToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'batchShopUpload';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Batch shop upload successful`);
        this.shopList.collapse();
    }
}

export class ShopCreatedToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'shopCreated';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Successfully created shop ${this.shopName} for ${this.merchantName}`);
        this.shopList.collapse();
    }
}

export class ShopUpdatedToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'shopUpdated';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Successfully updated shop ${this.shopName} for ${this.merchantName}`);
        this.shopList.collapse();
    }
}

export class ShopCancelled extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'shopCancelled';
    cancelled = true;

    getMessageToast(): void {
    }
} 

export class RuleCreatedToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'vnrCreated';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Successfully created voucher number rule ${this.ruleName} for ${this.merchantName}`);
        this.ruleList.collapse();
    }
}

export class RuleUpdatedToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'vnrUpdated';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Successfully updated voucher number rule ${this.ruleName} for ${this.merchantName}`);
        this.ruleList.collapse();
    }
}

export class RuleCancelled extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'vnrCancelled';
    cancelled = true;

    getMessageToast(): void {
    }
}

export class ContractCreatedToast extends BaseMerchantDetailsToast implements IMerchantDetailsToastDefinition {
    action = 'contractCreated';
    cancelled = false;

    getMessageToast(): void {
        this.toast.showSuccess(`Successfully created contract ${this.contractName} for ${this.merchantName}`);
    }
}