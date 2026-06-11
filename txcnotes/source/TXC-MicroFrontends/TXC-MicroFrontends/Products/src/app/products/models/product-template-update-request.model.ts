export interface ProductTemplateUpdateRequest {
    productId?: number;
    product_template_item: ProductTemplateItem[];
}

export interface ProductTemplateItem {
    templateType?: number;
    templateSubType?: number;
    templateVersionId?: number;
    templateTagValue: TemplateTagValueItem[];
}

export interface TemplateTagValueItem {
    tagId?: number;
    value?: string;
    textValue?: string;
}