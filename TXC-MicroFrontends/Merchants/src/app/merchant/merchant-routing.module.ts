import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantListComponent } from './components/merchant-list/merchant-list.component';
import { MerchantCreateComponent } from './components/merchant-create/merchant-create.component';
import { MerchantDetailsComponent } from './components/merchant-details/merchant-details.component';
import { MerchantEditComponent } from './components/merchant-edit/merchant-edit.component';
import { ShopCreateComponent } from './components/shops/shop-create/shop-create.component';
import { ShopEditComponent } from './components/shops/shop-edit/shop-edit.component';
import { ShopBatchUploadComponent } from './components/shops/shop-batch-upload/shop-batch-upload.component';
import { VoucherNumberRuleCreateComponent } from './components/voucher-number-rule/voucher-number-rule-create/voucher-number-rule-create.component';
import { VoucherNumberRuleEditComponent } from './components/voucher-number-rule/voucher-number-rule-edit/voucher-number-rule-edit.component';
import { ContractCreateComponent } from './components/contract/contract-create/contract-create.component';
import { SKUCreateComponent } from './components/sku/sku-create/sku-create.component';
import { MerchantGroupDetailsComponent } from './components/merchant-group/info/merchant-group-details/merchant-group-details.component';
import { AcceptanceLoopCreateComponent } from './components/acceptance-loop/acceptance-loop-create/acceptance-loop-create.component';
import { AcceptanceLoopEditComponent } from './components/acceptance-loop/acceptance-loop-edit/acceptance-loop-edit.component';
import { PageAuthorizationGuard } from '@txc-angular/authorization-library';
import { MerchantGroupManagementComponent } from './components/merchant-group/info/merchant-group-management/merchant-group-management.component';
import { MerchantGroupSkuManagementComponent } from './components/merchant-group/sku/merchant-group-sku-management/merchant-group-sku-management.component';
import { ContractDetailsComponent } from './components/contract/contract-details/contract-details.component';
import { MerchantGroupAcceptanceLoopCreateComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-create/merchant-group-acceptance-loop-create.component';
import { MerchantGroupAcceptanceLoopEditComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-edit/merchant-group-acceptance-loop-edit.component';
import { SkuEditComponent } from './components/sku/sku-edit/sku-edit.component';
import { ContractEditComponent } from './components/contract/contract-edit/contract-edit.component';
import { MerchantGroupSkuDetailsComponent } from './components/merchant-group/sku/merchant-group-sku-details/merchant-group-sku-details.component';
import { SkuCreateDraftDetailsComponent } from './components/sku/sku-create-draft-details/sku-create-draft-details.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantListComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'create',
        component: MerchantCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/create',
        component: MerchantGroupManagementComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'details',
        component: MerchantDetailsComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group-details',
        component: MerchantGroupDetailsComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'edit',
        component: MerchantEditComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/edit',
        component: MerchantGroupManagementComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'shop/create',
        component: ShopCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'shop/create/batch',
        component: ShopBatchUploadComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'shop/edit/:id',
        component: ShopEditComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'voucher-number-rule/create',
        component: VoucherNumberRuleCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'voucher-number-rule/edit/:id',
        component: VoucherNumberRuleEditComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'acceptance-loop/create',
        component: AcceptanceLoopCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'acceptance-loop/edit/:id',
        component: AcceptanceLoopEditComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'contract/create',
        component: ContractCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'contract/sku/create',
        component: SKUCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'contract/:id/sku/create/draft/details',
        component: SkuCreateDraftDetailsComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/sku/create',
        component: MerchantGroupSkuManagementComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/sku/edit',
        component: MerchantGroupSkuManagementComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/sku/details',
        component: MerchantGroupSkuDetailsComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'contract/details/:id',
        component: ContractDetailsComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'contract/edit/:id',
        component: ContractEditComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'sku/edit/:id',
        component: SkuEditComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/acceptance-loop/create',
        component: MerchantGroupAcceptanceLoopCreateComponent,
        canActivate: [PageAuthorizationGuard]
    },
    {
        path: 'merchant-group/acceptance-loop/edit/:id',
        component: MerchantGroupAcceptanceLoopEditComponent,
        canActivate: [PageAuthorizationGuard]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MerchantRoutingModule { }
