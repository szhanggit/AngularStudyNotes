import { Injectable } from '@angular/core';
import {
  CurrentProductTemplates,
  INITIAL_PRODUCT_TEMPLATE_STATE,
  ProductTemplate,
  ProductTemplateState,
} from '../../interface/product-template-state.interface';
import { StateService } from './state.service';
import { Template } from 'src/app/shared/models/template.model';

export const INITIAL_TEMPLATE : Template = {
  templateId: 0,
  templateVersionId: 0,
  templateName: '',
  type: 0,
  subType: 0,
  languageId: 0,
  status: 0,
  subject1: '',
  subject2: '',
  subject3: '',
  content1: '',
  content2: '',
  content3: '',
  attachmentTemplateVersionId: '',
  isCurrentVersion: true,
  version: 0,
  defaultLanguage: 0,
  defaultLanguageId: 0,
  templateTagValue: [],
  templateTags: [],
  keyword: '',
  productTemplateVersion: [],
  templateVersions: [],
  templateVersionLanguages: []
};

@Injectable({
  providedIn: 'root',
})
export class ProductTemplateStateService 
  extends StateService<ProductTemplateState> {
  productTemplateList: ProductTemplate[] = [];
  productTemplates$ = this.select((state) => state.currentProductTemplates);

  constructor() {
    super(INITIAL_PRODUCT_TEMPLATE_STATE);
  }

  setProductTemplatesByProductVersionId(
    productVersionId: number,
    orderTemplateId: number | null = null,
    voucherTemplate?: Template,
    tempVoucherTemplate?: Template,
    smsTemplate?: Template,
    tempSmsTemplate?: Template,
    reset = false,
    emailTemplateVersionId = undefined,
    smsTemplateVersionId = undefined,
  ) {
    const getIndex = this.productTemplateList.findIndex(
      (productTemplate) => productTemplate.productVersionId === productVersionId
    );

    // existing
    if (reset && getIndex > -1) {
      this.productTemplateList.splice(getIndex, 1);
      this.productTemplateList.unshift({
        productVersionId: productVersionId,
        voucherTemplate: voucherTemplate ?? INITIAL_TEMPLATE,
        tempVoucherTemplate: tempVoucherTemplate ?? INITIAL_TEMPLATE,
        smsTemplate: smsTemplate ?? INITIAL_TEMPLATE,
        tempSmsTemplate: tempSmsTemplate ?? INITIAL_TEMPLATE,
        emailTemplateVersionId: emailTemplateVersionId,
        smsTemplateVersionId: smsTemplateVersionId,
      });
    }

    if (!(getIndex > -1)) {
      this.productTemplateList.unshift({
        productVersionId: productVersionId,
        voucherTemplate: voucherTemplate ?? INITIAL_TEMPLATE,
        tempVoucherTemplate: tempVoucherTemplate ?? INITIAL_TEMPLATE,
        smsTemplate: smsTemplate ?? INITIAL_TEMPLATE,
        tempSmsTemplate: tempSmsTemplate ?? INITIAL_TEMPLATE,
      });
    }
    const currentProductTemplates: CurrentProductTemplates = {
      currentProductVersionId: productVersionId,
      currentOrderTemplateId: orderTemplateId,
      productTemplates: [...this.productTemplateList],
    };

    this.setState({ currentProductTemplates: currentProductTemplates });
  }

  resetProductTemplateState() {
    this.setState(INITIAL_PRODUCT_TEMPLATE_STATE);
    this.productTemplateList = [];
  }
}
