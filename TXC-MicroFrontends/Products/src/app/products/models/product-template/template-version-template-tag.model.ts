import { ProductTemplate } from "../product-wizard-dto.model";
import { TemplateTag } from "../template-tag.model";
import { Template } from "../template.model";

export interface TemplateVersionTemplateTag {
    templateTags: TemplateTag[];
    template: Template | ProductTemplate;
}