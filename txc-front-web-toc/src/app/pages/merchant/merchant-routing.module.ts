import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantListComponent } from './components/merchant-list/merchant-list.component';
import { CreateMerchantComponent } from './components/create-merchant/create-merchant.component';
import { MerchantDetailsComponent } from './components/merchant-details/merchant-details.component';
import { UpdateMerchantComponent } from './components/update-merchant/update-merchant.component';
import { ShopCreateComponent } from './components/shops/shop-create/shop-create.component';
import { ShopEditComponent } from './components/shops/shop-edit/shop-edit.component';
import { ShopBatchUploadComponent } from './components/shops/shop-batch-upload/shop-batch-upload.component';
import { ContractCreateComponent } from './components/contract/contract-create/contract-create.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantListComponent
    },
    {
        path: 'create',
        component: CreateMerchantComponent
    },
    {
        path: 'details',
        component: MerchantDetailsComponent
    },
    {
        path: 'edit',
        component: UpdateMerchantComponent
    },
    {
        path: 'shop/create',
        component: ShopCreateComponent
    },
    {
        path: 'shop/create/batch',
        component: ShopBatchUploadComponent
    },
    {
        path: 'shop/edit/:id',
        component: ShopEditComponent
    },
    {
        path: 'contract/create',
        component: ContractCreateComponent
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MerchantRoutingModule { }