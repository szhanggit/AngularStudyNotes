import { Template } from 'src/app/shared/models/template.model';

export interface ProductTemplate {
  productVersionId: number;
  emailTemplateVersionId?: number;
  smsTemplateVersionId?: number;
  voucherTemplate: Template | null;
  smsTemplate: Template | null;
  tempVoucherTemplate: Template | null;
  tempSmsTemplate: Template | null;
}

export interface CurrentProductTemplates {
  currentProductVersionId: number | null;
  currentOrderTemplateId: number | null;
  productTemplates: ProductTemplate[];
}

export interface ProductTemplateState {
  currentProductTemplates: CurrentProductTemplates;
}

export const INITIAL_PRODUCT_TEMPLATE_STATE: ProductTemplateState = {
  currentProductTemplates: {
    currentProductVersionId: null,
    currentOrderTemplateId: null,
    productTemplates: [],
  },
};
