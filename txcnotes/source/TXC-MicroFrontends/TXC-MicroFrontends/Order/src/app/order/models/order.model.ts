import { Product } from 'src/app/shared/models/product.model';

export interface Order {
    id: number;
    clientQuotationId: number;
    orderName: string;
    orderNumber: string;
    mode: number;
    createdBy: string;
    createdDateTime: string;
    isDirectDelivery: boolean;
    publishDateTime: string | null;
    orderActivateMode: number;
    fixedDate: string;
    afterPublished: number;
    indirectFileFormat: number;
    urlType: number;
    exportBarcodeInfo: number;
    emailAttachShortUrlImageId: number;
    shortUrlAuthCodeGenerationWay: number;
    generateSequenceNumber: boolean;
    orderChannelId: number;
    memo: string;
    orderLines: OrderLine[];
    quotation: Quotation[];
    mwvEmailTemplateId: number;
    emailGreeting: string;
    emailSubject: string;
    smsGreeting: string;
    msgEncoding: number;
    status: number;
    comment: string;
    operator: string;
  }

  export interface OrderLine {
    id: number;
    status: number;
    totalQuantity: number;
    emailQuantity: number;
    smsQuantity: number;
    remainingQuantity: number | null;
    voucherReservationCode: string;
    clientOrderNumber: string;
    productVersionId: number;
    expirationPolicyId: number;
    expirySchemeText?: string;
    defaultExpirationDate: string;
    messageEncoding: string;
    productVersion: ProductVersion[];
    orderLineDetails: OrderLineDetails[];
    orderLineTemplateId: number;
    orderLineTemplate: OrderLineTemplate;
    isMaster?: boolean;
  }
  
  interface Quotation {
    id: number;
    quotationNumber: string;
    status: number;
    clintById: {
      clientName?: string;
    }[];
  }

  export interface ProductVersion {
    productVersionId: number;
    skuId: number;
    product: Product;
  }

  export interface OrderLineTemplate {
    orderLineTemplateId: number;
    orderLineTemplateSet: OrderLineTemplateSet[];
  }

  export interface OrderLineTemplateSet {
    orderLineTemplateSetId: number;
    templateType: number;
    templateSubType: number;
    orderLineTemplateVersionId: number;
    orderLineTemplateVersion: OrderLineTemplateVersion;
  }

  interface OrderLineTemplateVersion {
    templateVersionId: number;
    orderLineTemplateTagValue: OrderLineTemplateTagValue;
  }

  interface OrderLineTemplateTagValue {
    orderLineTemplateTagValueId: number;
    orderLineTemplateTagValueSet: OrderLineTemplateTagValueSet[];
  }

  interface OrderLineTemplateTagValueSet {
    orderLineTemplateTagSetId: number;
    tagId: number;
    value: string;
  }

  interface OrderLineTemplateTagValue {

  }

  export interface OrderLineDetails {
    id: number;
    faceValue: number;
    soldPrice: number;
    voucherQuantity: number;
    emailQty?: number;
    smsQty?: number;
    email?: string;
    mobile?: string;
    voucherId?: number;
  }

  export interface ServedQuantity {
    id: number;
    quotationId: number;
    productVersionId: number;
    remainingQuantity: number;
  }

  export interface ExpirationPolicy {
    id: number;
    name: string;
  }

  export interface Reservation {
    skuId: number;
    inventoryBatch: InventoryBatch[];
  }

  interface InventoryBatch {
    id: number;
    reservationCode: string;
  }