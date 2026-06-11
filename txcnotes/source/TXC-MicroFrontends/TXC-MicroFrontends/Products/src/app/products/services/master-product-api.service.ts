import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { ExternalPropertyBody } from '../models/external-property-body';
import { MasterProductWizardRequest } from '../models/master-product/master-product.model';
import { ProductExpirationPolicyUpdateRequest } from '../models/product-expiration-policy-update-request.model';
import { ProductPriceUpdateRequest } from '../models/product-price-update-request.model';
import { ProductUpdateRequest } from '../models/product-update-request.model';
import { GraphqlApiService } from './graphql-api.service';
import { TenantConfigService } from './tenant-config.service';
import { ProductComboUpdateRequest } from '../models/product-combo-update-request.model';
import { UpdateBatchFootnoteRequest } from '../models/put-batchfootnote-request';
import { ProductTemplateUpdateRequest } from '../models/product-template-update-request.model';
import { BatchUpdateProductComboRequest } from '../models/master-product/batch-update-product-combo.model';
import { ProductVoucherGeneratorEnum } from '../enums/voucher-generator.enum';

@Injectable({
  providedIn: 'root'
})
export class MasterProductApiService {
  private readonly MAX_TAKE = 1000;

  constructor(
    private readonly http: HttpClient,
    private readonly _authorizationLibraryService: AuthorizationLibraryService,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly graphqlApiService: GraphqlApiService,) { }

  // Product wizard

  initializeProductWizard(productType: number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard`;
    return this.http.post(url, { productType }) as Observable<BaseResponse>;
  }

  getProductWizard(wizardKey: string): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard/Detail?WizardKey=${wizardKey}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  getProductWizardByProductCode(productCode: string): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard?ProductCode=${productCode}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  updateProductWizard(wizardKey: string, step: number, values: any): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard`;
    let body: MasterProductWizardRequest = new MasterProductWizardRequest(wizardKey, step, values);
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  createProductByWizard(wizardKey: string, timeOffsetHour?: number, timeOffsetMinute?: number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Product`;
    if (timeOffsetHour != undefined && timeOffsetMinute != undefined)
      return this.http.post(url, { wizardKey: wizardKey, timeOffsetHour: timeOffsetHour, timeOffsetMinute: timeOffsetMinute }) as Observable<BaseResponse>;
    return this.http.post(url, { wizardKey: wizardKey }) as Observable<BaseResponse>;
  }

  // Product

  updateProductBasicInfo(value: ProductUpdateRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product`;
    return this.http.put(url, value) as Observable<BaseResponse>;
  }

  getTemplateByProductId(productId: number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Template?ProductId=${productId}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  updateProductTemplate(value: ProductTemplateUpdateRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Template`;
    return this.http.put(url, value) as Observable<BaseResponse>;
  }

  getMasterProductCombo(productId: number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Combo?ProductId=${productId}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  updateProductPrice(body: ProductPriceUpdateRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Price`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  updateProductExpirationPolicy(body: ProductExpirationPolicyUpdateRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ExpirationPolicy`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  updateProductCombo(body: ProductComboUpdateRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Combo`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  updateBatchFootnote(body: UpdateBatchFootnoteRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/BatchFootnote`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  downloadBatchUpdateProductComboTemplate() {
    const url = `https://${environment.apiUrl}api/Product/DownloadBatchUpdateProductComboTemplate`;
    // const headers = new HttpHeaders().set('Accept', '*/*');
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  // tmp repalcement before fixing graphQL version
  getExternalPropertiesByProductId(productId: number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ExternalProperty?ProductId=${productId}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  updateProductExternalProperty(body: ExternalPropertyBody): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ExternalProperty`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  updateStopIssueTime(productId: number, datetime: string): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/StopIssue`;
    const body = new FormData();
    body.append('ProductId', productId.toString());
    body.append('CanIssue', 'false');
    body.append('StopIssueTime', datetime);
    let headers: HttpHeaders = this._authorizationLibraryService.getAMMHeaders(
      this._tenantConfigService.getTenant()
    ).delete('content-type')
    return this.http.put(url, body, { headers }) as Observable<BaseResponse>;
  }

  uploadBatchUpdateProductCombo(file: File): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/UploadBatchUpdateProductCombo`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData) as Observable<BaseResponse>;
  }

  batchUpdateProductCombo(body: BatchUpdateProductComboRequest): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/BatchCombo`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  // GraphQL

  getMasterProductMerchantById(merchantId: number): Observable<BaseResponse> {
    const query = `
      query {
        merchants(
          where: { merchantId: { eq: ${merchantId} } }
        ) {
          items {
            merchantId
            programId
            name
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getMasterProductVoucherNumberRuleById(voucherNumberRuleId: number): Observable<BaseResponse> {
    const query = `
      query {
        voucherNumberRules(
          where: { voucherNumberRuleId: { eq: ${voucherNumberRuleId} } }
        ) {
          items {
            merchantId
            ruleName
            voucherNumberPrefix
            voucherNumberType
            voucherNumberLength
            barcodeType {
              description
            }
            distVoucherNumUnderBarcode
            pinType {
              description
            }
            createdBy
            createdDateTime
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getMasterProductContractById(contractId: number): Observable<BaseResponse> {
    const query = `
      query {
        contract(contractId: ${contractId}) {
          startDate
          endDate
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getTaxRate(): Observable<BaseResponse> {
    const query = `
      query {
        taxRateByTenantId {
          companyTaxRate
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getExpirationPoliciesByGeneratorEnumList(generatorEnumList: ProductVoucherGeneratorEnum[]) {
    const generators = generatorEnumList.join(',');
    const query = `
      query {
        expirationPolicyByGeneratorEnum (
          generatorEnums: [ ${generators} ]
          order: [{ type: ASC },{ validPeriod: ASC }]
        ) {
          id
          name
          displayName
          type
          productVoucherGenerator
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getExpirationPoliciesByIds(ids: (number | undefined)[]): Observable<BaseResponse> {
    let conditions: string = '';
    ids.forEach((id) => {
      if (id) conditions = conditions + `{id: {eq: ${id}}},`;
    });
    const query = `
      query {
        expirationPolicies (
          where: { or: [${conditions}] },
          order: { type: ASC }
        ){
          id,
          displayName,
          type,
          name,
          productVoucherGenerator,
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductInfoByProductIdList(ids: (number | undefined)[]): Observable<BaseResponse> {
    let conditions: string = `productIds: [${ids.join(',')}]`;
    return this.getProductInfoGraphQL(conditions);
  }

  getProductInfoByProductCodeList(codes: string[]): Observable<BaseResponse> {
    let conditions: string = 'productCodes: [';
    codes.forEach((code) => {
      conditions = conditions + `"${code}",`;
    });
    conditions = conditions + ']';

    return this.getProductInfoGraphQL(conditions);
  }

  productInfoByKeyword(keyword: string): Observable<BaseResponse> {
    let conditions: string = '';
    conditions = `productName: "${keyword}"`;
    return this.getProductInfoGraphQL(conditions);
  }

  private getProductInfoGraphQL(conditions: string): Observable<BaseResponse> {
    const query = `
    query{
      productInfoMassive(
        take: 500,
        order: { productId: DESC },
        ${conditions}
      ) {
        items{
          productId,
          productName,
          productCode,
          productType,
          currentProductVersionId,
          stopIssueTime,
          status,
          multipleSelectionType,
          brand {
            brandName
          },
          contractSKU {
            skuNumber,
            faceValueWithTax,
            multiplier,
            contractSKUCosts{
              costWithTax,
              costWithoutTax,
              validStartDate,
              validEndDate,
              statusId
            }
          }
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductVersionsByIdList(ids: (number | undefined)[]): Observable<BaseResponse> {
    let conditions: string = `productVersionIds: [${ids.join(',')}]`;
    return this.getProductVersionsGraphQL(conditions);
  }

  private getProductVersionsGraphQL(conditions: string): Observable<BaseResponse> {
    const query = `
    query{
      productVersionInfoMassive(
        take: 1000,
        order: { productId: DESC },
        ${conditions}
      ) {
        items{
          product{
            brand{
              brandName
            }
          }
          productVersionId,
          productId,
          productName,
          productCode,
          productType,
          brand{
            brandName
          },
          skuId,
          contractSKU{
            skuNumber,
            faceValueWithTax,
            multiplier
          }
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductBasicInfoById(productId: number): Observable<BaseResponse> {
    const query = `
      query {
        products(
          where: { productId: { eq: ${productId} } }
        ) {
          items {
            productId
            productType
            productName
            productCode
            status
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductDetailsById(productId: number): Observable<BaseResponse> {
    const query = `
      query {
        products(
          where: { productId: { eq: ${productId} } }
        ) {
          items {
            programId
            productId
            productType
            productName
            productCode
            externalProductCode
            skuId
            brandId
            acceptanceLoopId
            description
            operationNote
            salesNote
            customerServiceNote
            isDeferredChild
            isCartVersion
            voucher_Issuer_Id
            productCategory
            productTag
            productIssuer
            pinCodeType
            pinCodeLength
            canExtend
            extensionSchemeId
            maxExtendTimes
            extensionEndDate
            sameAsContractEndDate
            lastUpdatedBy
            issue_Merchant

            contractSKU {
              skuName
              skuNumber
              voucherNumberRuleId
            }
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductPricingExpiryInfoByProductId(productId: number): Observable<BaseResponse> {
    const query = `
      query {
        products(
          where: { productId: { eq: ${productId} } }
        ) {
          items {
            productType
            contractSKU {
              skuNumber
              faceValueWithTax
              faceValueWithoutTax
              contractSKUCosts {
                costWithTax
                costWithoutTax
                statusId
                validStartDate
                validEndDate
              }
            }
            productPrice {
              sellingPricePrepaid
              sellingPricePrepaidWithTax
              sellingPricePostpaid
              sellingPricePostpaidWithTax
            }
            productExpirySchemes {
              expirationPolicyId
            }
            expiryDate
            isFixedExpiryPolicy
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductPricingInfo(productIds: number[]): Observable<BaseResponse> {
    const ids = productIds.join(',');
    const query = `
      query {
        productInfoByProductCodeList(productCodeListStr: ""
          where: {
            productId: {
              in: [ ${ids} ]
            }
          }
        ) {
          productId,
          productName,
          productCode,
          productPrice {
            sellingPricePrepaid,
            sellingPricePrepaidWithTax,
            sellingPricePostpaid,
            sellingPricePostpaidWithTax
          },
          contractSKU {
            faceValueWithTax,
            faceValueWithoutTax,
            typeId,
            multiplier,
            contractSKUCosts {
              costWithTax
              costWithoutTax
              validStartDate
              validEndDate
              skuCostContract {
                costSchemeId
              }
            }
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductVersionPricingInfoByVersionIds(productVersionIds: number[], take: number = this.MAX_TAKE): Observable<BaseResponse> {
    const ids = productVersionIds.join(',');
    const query = `
      query {
        productVersionInfoMassive(
          productVersionIds: [ ${ids} ]
          take: ${take}
        ) {
          items {
            productVersionId
            productId
            productName
            productCode
            productType
            productPrice {
              sellingPricePrepaid
              sellingPricePrepaidWithTax
              sellingPricePostpaid
              sellingPricePostpaidWithTax
              customerFeePrePaidWithTax
            }
            contractSKU {
              faceValueWithTax
              faceValueWithoutTax
              typeId
              multiplier
              contractSKUCosts {
                costWithTax
                costWithoutTax
                validStartDate
                validEndDate
                skuCostContract {
                  costSchemeId
                }
              }
            }
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductDetails(productId: number): Observable<BaseResponse> {
    const query = `
    query {
      products(
        where: { productId: { eq: ${productId} } }
      ) {
        items {
          programId
          productId
          productType
          productName
          productCode
          description
          operationNote
          stopIssueTime
          salesNote
          customerServiceNote
          isDeferredChild
          isCartVersion
          voucher_Issuer_Id
          contractSKU {
            skuName
            skuNumber
            voucherNumberRuleId
            faceValueWithTax
            faceValueWithoutTax
            contractSKUCosts {
              costWithTax
              costWithoutTax
              validStartDate
              validEndDate
            }
          }
          productPrice {
              sellingPricePrepaid
              sellingPricePrepaidWithTax
              sellingPricePostpaid
              sellingPricePostpaidWithTax
          }
          productExpirySchemes {
              expirationPolicyId
          }
          expiryDate
          isFixedExpiryPolicy
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getStopIssueTimeByProductId(productId: number): Observable<BaseResponse> {
    const query = `
    query {
      products(
        where: { productId: { eq: ${productId} } }
      ) {
        items {
          programId
          productId
          productType
          productName
          productCode
          stopIssueTime
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductCountByProductCode(productCode: string): Observable<BaseResponse> {
    const query = `
      query {
        products(
          where: { productCode: { eq: "${productCode}" } }
        ) {
          totalCount
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getTemplateDetails(type: number, templateVersionId: number): Observable<BaseResponse> {
    const query = `
    query{
      templateVersionInfo (skip: 0, take: 100,
        where: {  
              and: [
                {templateVersionId: {eq: ${templateVersionId}}}
                {type:  {eq: ${type}}}
              ]
        }
      ){            
        items {
          templateId,
          subject1,
          subject2,
          subject3,
          subType,
          status,
          content1,
          content2,
          content3,
          isCurrentVersion,
          attachmentTemplateVersionId,
          defaultLanguage,
          description,
          languageId,
          templateName,
          templateVersionId,
          version
        },
        totalCount
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getTagsByTemplateVersionId(templateVersionId: number): Observable<BaseResponse> {
    const 
      query = `
      query{
        tagsByTemplateVersionId(templateVersionId: ${templateVersionId}) {
          displayName,
          applyToHtmlTemplate,
          applyToTextTemplate,
          category,
          defaultValue,
          displayName,
          description,
          reflectionType,
          scopeLevel,
          tagId,
          tagName,
          type
        }
      }`
    
      return this.graphqlApiService.postQuery(query);
  }

  getTagValueByTagIds(tagIds: number[]): Observable<BaseResponse> {
    const ids = tagIds.join(',');
    const query = `      
      query{
        tagValues(where:{tagId :{in:[${ids}]}})
        {
            items
            {
                tagId
                tagValueId
                tags
                {
                    tagId
                    tagName
                }
                htmlValue
                textValue
                isDefault
                applyConditions
                 {
                   name,
                   applyConditionId,
                 }
            }
        }
      }`
    
    return this.graphqlApiService.postQuery(query);
  }

  getDefaultAcceptanceLoopByMerchantId(merchantId: number): Observable<BaseResponse> {
    const query = `
      query{
        monoAcceptanceLoopByMerchantId(
          merchantId: ${merchantId}
          where: {
              status: { eq: true }
              isDefault: { eq: true }
          }
        ) {
          items {
            acceptanceLoopId
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductReverseLimitByName(name: string): Observable<BaseResponse> {
    const query = `
      query{
        productReverseLimit (
          where: {
            name: {eq: "${name}" }
          }
        ) {
          items {
            reverseLimitId
            name
            description
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  // TODO: it returns error if no external properties existed for the product
  getExternalPropertiesByProductId_ToBeFixed(productId: number): Observable<BaseResponse> {
    const query = `
      query {
        products(
          where: { productId: { eq: ${productId} } }
        ) {
          items {
            productExternalProperties {
              productExternalPropertySets {
                id
                productExternalPropertyId
                propertyName
                propertyValue
                description
              }
            }
          }
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }


}
