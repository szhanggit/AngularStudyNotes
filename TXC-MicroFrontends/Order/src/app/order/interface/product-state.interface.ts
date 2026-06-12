export interface EmailTemplateOption {
  label: string;
  value: number;
}

export interface ProductState {
  emailTemplateOptions: EmailTemplateOption[];
}

export const INITIAL_PRODUCT_STATE: ProductState = {
  emailTemplateOptions: [],
};
