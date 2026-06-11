export interface BatchUpdateProductCombo {
  index?: number,
  masterProductId?: number,
  masterProductCode?: string,
  masterProductName?: string,
  childProductId?: number,
  childProductCode?: string,
  childProductName?: string,
  error?: string
}

export interface BatchUpdateProductComboRequest {
  updateProductComboList?: Array<UpdateProductComboListItem>
}

export interface UpdateProductComboListItem {
  masterProductId?: number,
  childProductId?: number
}