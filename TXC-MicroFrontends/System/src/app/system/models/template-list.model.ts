export interface GetTemplateList {
    data: {
        templateDtos: Template[],
        totalCount: number
    }
    message: string;
    success: boolean;
}

export interface Template {
    templateVersionId: number,
    templateId: number,
    languageId: number,
    defaultLanguage: number,
    templateName: string,
    type: number,
    subType: number,
    status: number,
    version: number,
    description: string,
    subject1: number,
    content1: string,
    subject2: string,
    content2: string,
    subject3: string,
    content3: string,
    attachmentTemplateVersionId: number,
    createdBy: string,
    createdOn: string,
    lastModifiedBy: string,
    lastModifiedOn: string
}