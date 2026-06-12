import { TagValue } from "./product-wizard-dto.model";

export interface Template {
    templateId: number;
    templateName: string;
    type: number;
    subType: number;
    status: number;
    description: number;
    languageId: number;
    subject1: string;
    content1: string;
    subject2: string;
    content2: string;
    subject3: string;
    content3: string;
    attachmentTemplateVersionId: number;
    isCurrentVersion: boolean;
    templateVersionId: number;
    version: number;
    defaultLanguage?: number;
    defaultLanguageId?: number;
    templateTagValue?: TagValue[];
    tagValueList?: any;
}