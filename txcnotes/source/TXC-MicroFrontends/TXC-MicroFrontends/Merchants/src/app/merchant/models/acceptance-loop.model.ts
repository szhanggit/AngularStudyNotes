import { NumberValueAccessor } from "@angular/forms"
import { Merchant } from "./merchant.model"
import { Shop } from "./shop.model"

export interface AcceptanceLoop {
    acceptanceLoopId: number,
    code: string,
    description: string,
    status: boolean,
    isDefault: boolean,
    createdOn:Date,
    createdBy: string,
    lastUpdatedOn?:Date,
}

export interface AcceptanceLoopDetail extends AcceptanceLoop {
    acceptanceLoopMerchants : AcceptanceLoopMerchant[]
}

export interface AcceptanceLoopMerchant {
    acceptanceLoopMerchantId: number,
    acceptanceLoopId: number,
    merchantId: number,
    status: boolean,
    merchant:Merchant[]
    acceptanceLoopMerchantShops: AcceptanceLoopMerchantShop[]
}

export interface AcceptanceLoopMerchantShop {
    acceptanceLoopMerchantShopId: number,
    shopId:number,
    status: boolean,
    hasChanged: boolean,
    shop: Shop[]
}

export interface AcceptanceLoopEditRequest extends AcceptanceLoop {
    createAcceptanceLoops: AcceptanceLoopMerchantRequest[],
    editAcceptanceLoops: AcceptanceLoopMerchantRequest[]
}

export interface AcceptanceLoopMerchantRequest {
    acceptanceLoopMerchantId?: number,
    merchantId: number,
    status: boolean,
    acceptanceLoopMerchantShops: AcceptanceLoopMerchantShopRequest[]
}

export interface AcceptanceLoopMerchantShopRequest {
    acceptanceLoopMerchantShopId?: number,
    status: boolean,
    shopId: number
}

export interface AcceptanceLoopCreateRequest extends AcceptanceLoop {
    acceptanceLoopMerchants: AcceptanceLoopMerchantRequest[]
}

export interface AcceptanceLoopMerchantShopsResponse {
    acceptanceLoopMerchantShops: [AcceptanceLoopMerchantShopResponse]
}

export interface AcceptanceLoopMerchantShopResponse {
    acceptanceLoopMerchantShopId: number,
    status: boolean
    merchantShop: ShopResponse
}

export interface ShopResponse {
    identityCode: string,
    name: string,
    shopId: number,
    status: number,
    createdOn: Date,
}

export interface ShopModalInfo {
    title: string,
    merchantId: number,
    acceptanceLoopId: number,
    acceptanceLoopMerchantId: number,
    mode: OpenMode,
    acceptanceLoopMerchantShops?: ShopOption[]
    acceptanceLoopLastUpdateDate? : Date,
    shopSelectedType: ShopSelectedType,
    selectedShopCount: number,
    merchantAllShopCount: number,
    acceptanceLoopLastUpdatedOn?: Date,
    IsCountedByActiveShopOnly: boolean
}

export interface ShopOption extends Shop {
    isSelected: boolean,
    acceptanceLoopMerchantShopId: number,
    isVisible: boolean,
    isSelectedOrigin?: boolean,
    createdOn? : Date,
    hasChanged: boolean
}

export enum OpenMode {
    view = 0,
    create = 1,
    edit = 2
}

export interface ALPageState {
    pageSize: number,
    pageSelected: number,
    pageUnselected: number
}

export enum ShopSelectedType {
    none = 0,
    includeAllShop = 1,
    excludeAllShop = 2
}

export interface AcceptanceLoopMerchantGroup {
    name: string,
    description: string,
    status: boolean,
    merchantGroupId: number,
    acceptanceLoopId: number,
    acceptanceLoopMerchants: AcceptanceLoopMerchantGroupMerchant[]
}

export interface AcceptanceLoopMerchantGroupMerchant {
    merchantAllShopCount: number
    merchantId: number,
    merchantName: string,
    selectedShopCount: number,
    availableShopCount: number,
    merchantInactiveShopCount: number,
    merchantActiveShopCount: number,
    shopSelectedType: ShopSelectedType,
    status: boolean,
    acceptanceLoopMerchantId: number,
    acceptanceLoopMerchantShops: AcceptanceLoopMerchantShop[]
}

export interface GroupAcceptanceLoop extends AcceptanceLoop {
    products: ALProduct,
    merchantAggregation: MerchantAggregation[],

    isExpanded: boolean;
    merchantsDisplay: MerchantAggregation[],
}

export interface ALProduct {
    totalCount: number
}

export interface MerchantAggregation {
    acceptanceLoopMerchantId: number,
    merchantId: number,
    merchantName: string,
    availableShopCount: number,
    selectedShopCount: number,
    merchantShopCount: number,
    merchantActiveShopCount: number,
    merchantInactiveShopCount: number,
}

export interface PageDetails {
    currentPage: number,
    pageCount: number,
    pageSize: number,
    itemStart: number,
    itemEnd: number,
    total: number,
}

export interface GeneralViewModalInfo {
    title: string,
    id: number,
    itemType: ViewItemType,
    options?: any,
}

export interface GeneralViewItem {
    id: number,
    name: string,
    status: number,
    code: string,
}

export enum ViewItemType {
    shop = 1,
    product = 2
}

export interface Product {
    productId: number,
    productName: string,
    productCode: string,
}

export interface MonoAcceptanceLoop {
    acceptanceLoopId : number,
    code : string,
    description : string,
    isDefault : boolean,
    shopCountAvailableInAL : number,
    status : boolean,
    createdBy : string,
    createdOn : Date
}
