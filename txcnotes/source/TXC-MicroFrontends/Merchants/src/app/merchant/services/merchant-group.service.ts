import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { MerchantGroupTableState } from '../models/merchant-group-table-state.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { tap, debounceTime, switchMap, delay } from 'rxjs/operators';
import { TenantConfigService } from './tenant-config.service';
import { MerchantGroup } from '../models/get-merchant-group-response.model';
import { BaseResponse } from './base-response.model';
import { EditMerchantGroupRequest } from '../models/edit-merchant-group.models';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { PageDetails } from '../models/merchant-group-sku.model';

@Injectable({
  providedIn: 'root'
})
export class MerchantGroupService {

  /** initialize observables
       Group related*/
  private _groupLoading$ = new BehaviorSubject<boolean>(true);
  private _merchantsGroup$ = new BehaviorSubject<MerchantGroup[]>([]);
  private _groupTotal$ = new BehaviorSubject<number>(0);
  private _search$ = new Subject<void>();


  // default merchant group table state values
  private _state: MerchantGroupTableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    merchantGroupId: 0,
    createdBy: 0
  }

  get merchantsGroup$() { return this._merchantsGroup$.asObservable(); }
  get groupTotal$() { return this._groupTotal$.asObservable(); }
  get goupLoading$() { return this._groupLoading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get status() { return this._state.status }
  get merchantGroupId() { return this._state.merchantGroupId; }
  get createdBy() { return this._state.createdBy; }


  // merchant table property setters, when change will reactively call merchantgroupService._getMerchantGroups based on properties provided
  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm.toLowerCase() }); }
  set status(status: number) { this._set({ status }); }
  set merchantGroupId(merchantGroupId: number) { this._set({ merchantGroupId }); }
  set createdBy(createdBy: number) { this._set({ createdBy }); }


  // returns the right protocol http | https
  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  private _graphQL: string = `${this._getURL()}api/GraphQL/Query`;


  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService,
    private ngbCalendar: NgbCalendar,
  ) {
    // subscribe into _search$ observable to fetch merchants if there are changes in the properties
    this._search$.pipe(
      tap(() => this._groupLoading$.next(true)),
      debounceTime(800),
      switchMap(() => this._getMerchantGroups()),
      delay(200),
      tap(() => this._groupLoading$.next(false))
    ).subscribe((res: BaseResponse) => {
      if (res.data) {
        const result = JSON.parse(res.data);
        // trigger next if there are data retrieve
        this._merchantsGroup$.next(result.merchantGroups.items);
        this._groupTotal$.next(result.merchantGroups.totalCount);
      } else {
        this._merchantsGroup$.next([]);
        this._groupTotal$.next(0);
      }
    },
      error => {
        console.log(error);
      },
    );

    this._search$.next();
  }

  private _getHeaders(): HttpHeaders {
    return this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant());
  }

  private _set(patch: Partial<MerchantGroupTableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  getDefaultProgram(tenantId: number): Observable<BaseResponse> {
    const body = {
      query: `
        query {
          programs(where: {
            and: [
              {
                isDefaultProgram: {eq: true}
                tenantId: {eq: ${tenantId}}
              }
            ]
          }) {
            items {
              id
              name
            }
          }
        }
      `
    }

    return this.http.post(this._graphQL, body) as Observable<BaseResponse>;
  }

  getMerchants(nameOrIdentityCode: string = '', pageNumber: number, excludedMerchantId: string, defaultProgramId: number): Observable<BaseResponse> {
    const searchCriteria = nameOrIdentityCode.trim();
    const pageSize = 50;
    const body = {
      query:
        `query {
          merchants (where: {
                and: [
                  {or: [{name: {contains: "${searchCriteria}"}}, {identityCode: {contains: "${searchCriteria}"}}]},
                  {merchantGroupId: {eq: null}},
                  {merchantId: {nin: [${excludedMerchantId}]}},
                  {programId: { eq: ${defaultProgramId} }}
                ]
              }
              skip: ${(pageNumber - 1) * pageSize}
              take: ${pageSize}){
              items {
                  identityCode
                  name
                  merchantId
                  merchantGroupId
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  updateMerchantGroup(merchantgroup: EditMerchantGroupRequest): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantGroup`;
    return this.http.put(url, merchantgroup, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<any>;
  }


  private _getMerchantGroups(): Observable<BaseResponse> {
    const searchCriteriaQuery = this.searchTerm.trim() ? `where: { merchant: { name: { contains: "${this.searchTerm.trim()}"} } }` : '';
    const body = {
      query:
        `query {
          merchantGroups(
            ${searchCriteriaQuery}
            take: ${this._state.pageSize}
            skip: ${(this._state.page - 1) * this._state.pageSize}
            order: { createdOn: DESC }
          ) {
            totalCount
            items {
              merchantGroupId
              merchantId
              merchant {
                name
                status
              }
              merchantGroupMerchantMaps {
                merchantGroupMerchantMapId
                merchantGroupId
                merchantId
                status
              }
            }
          }
        }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  createMerchantGroup(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantGroup`;
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }


  public getMerchantGroupByMerchantId(merchantId: number): Observable<BaseResponse> {
    const body = {
      query:
        `query {
          merchantGroups(
            where: { merchantId: { eq: ${merchantId} } }
          ) {
            items {
              merchantGroupId
              merchantId
              merchant {
                name
                description
                programId
                status
              }
              merchantGroupMerchantMaps {
                merchantGroupMerchantMapId
                merchantGroupId
                merchantId
                merchant {
                  name
                  identityCode
                }
                status
              }
            }
          }
        }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getGroupVnrByMerchantGroupId(merchantGroupId: number) {
    const body = {
      query:
        `query {
          voucherNumberRules(where: {and: [{merchantId: {eq: ${merchantGroupId}}}, {isDeleted: {eq: false}}]}) {
              items{
                  voucherNumberRuleId
                  ruleName
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getContractListByMerchantId(merchantId: number) {
    const body = {
      query:
        `query {
          contracts(merchantId: ${merchantId}){
              items {
                  contractId
                  contractName
                  startDate
                  endDate
                  statusId
                  costSchemeId
                  costPercentage
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }


  getSkuType() {
    const body = {
      query:
        `query {
          contractSkuTypes {
              items {
                  id
                  value
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getGroupSkuByMerchantId(merchantGroupId: number, isValid: boolean, pageInfo: PageDetails, searchCriteria?: string) {
    const today = `${this.ngbCalendar.getToday().year}-${this.ngbCalendar.getToday().month}-${this.ngbCalendar.getToday().day}`;
    const validQuery = `{ some: { and:[{validEndDate: { gte:"${today}" }}]  }}`;
    const invalidQuery = `{ all: { or:[{validEndDate: { lt:"${today}" }},  {statusId: { eq: 3}} ]  }}`;
    const query = isValid ? validQuery : invalidQuery;
    const body = {
      query:
        `query{
          contractSKUDetails(where: { and: [{ merchantGroupId: { eq: ${merchantGroupId} } },
            { contractSKUCosts: ${query} },
            {or :[{skuName:{contains :"${searchCriteria}"}} , {skuNumber:{contains :"${searchCriteria}"}}]}
            ]} skip : ${(pageInfo.currentPage - 1) * pageInfo.pageSize} take : ${pageInfo.pageSize}
          ) {
            totalCount
            items {
              id,
              skuName,
              skuNumber,
              skuType {
                id,
                value
              },
              faceValueWithTax,
              faceValueWithoutTax,
              voucherNumberRule {
                voucherNumberRuleId,
                ruleName
              },
              createdBy,
              createdDateTime,
              merchantGroupId,
              contractSKUCosts {
                validStartDate
                validEndDate
                contractSkuStatus {
                  id,
                  value
                }
              }
            }
          }
        }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getGroupSkuDetailsBySkuId(id: number) {
    const body = {
      query:
        `query{
          contractSKUDetails(where:{id:{eq:${id}}}
          ) {
            items {
              id,
              skuName,
              skuNumber,
              skuType {
                id,
                value
              },
              multiplier,
              faceValueWithTax,
              voucherNumberRule {
                voucherNumberRuleId,
                ruleName
              },
              createdBy,
              createdDateTime,
              merchantGroupId,
              contractSKUCosts {
                id,
                costWithTax,
                costWithoutTax,
                validStartDate,
                validEndDate,
                contractSkuStatus {
                  id,
                  value
                },
                createdBy,
                createdDateTime,
                skuCostContract {
                  contractId,
                  contractName,
                  merchantId,
                  startDate,
                  endDate,
                  merchant
                  {
                      merchantId
                      status
                      name
                      contracts {
                        contractId
                        contractName
                        startDate
                        endDate
                        costSchemeId
                        costPercentage
                    }
                  },
                  contractCostScheme {
                    id,
                    value
                  },
                }
              }
            }
          }
        }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getGroupSkuDetailsBySkuIdForViewOnly(id: number) {
    const body = {
      query:
        `query{
          contractSKUDetails(where:{id:{eq:${id}}}
          ) {
            items {
              id,
              skuName,
              skuNumber,
              skuType {
                id,
                value
              },
              multiplier,
              faceValueWithTax,
              voucherNumberRule {
                voucherNumberRuleId,
                ruleName
              },
              createdBy,
              createdDateTime,
              merchantGroupId,
             contractSKUCosts { 
                id,
                costWithTax,
                costWithoutTax,
                validStartDate,
                validEndDate,
                contractSkuStatus {
                  id,
                  value
                },
                createdBy,
                createdDateTime,
                contractId
              }
            }
          }
        }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getContractsDetails(contractList: number[]) {
    const body = {
      query:
        `query{
            contractInfo(
                where: {
                    contractId: {
                        in: [${contractList}]
                    }
                }
            ){
                items {
                    contractId
                    contractName
                    contractNumber
                    costSchemeId
                    merchant {
                        merchantId
                        name
                    }
                }
            }
        }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }


  getTaxRate(): Observable<BaseResponse> {
    const body = {
      query: `
      query {
        taxRateByTenantId {
          companyTaxRate
        }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getContractInfoWithValidPeriod(merchantId: number, costSchemeId: number, today: string) {
    const body = {
      query:
        `query{
          contractInfo(
              where: {
                  merchantId: { eq: ${merchantId} }
                  costSchemeId: { eq: ${costSchemeId} }
                  endDate: { gte: "${today}"}
              }
          ){
              items {
                  contractId
                  contractName
                  costPercentage
                  startDate
                  endDate
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getMerchantContractsByGroupId(merchantGroupId: number, costSchemeId?: number) {
    const costSchemeIdQuery = costSchemeId ? `some: { costSchemeId: { eq: ${costSchemeId} } }` : 'any: true'
    const body = {
      query:
        `query {
          merchantGroupMerchantMaps(
              where: {
                  and: [
                      { merchantGroupId: { eq: ${merchantGroupId}} },
                      { merchant: { contracts: { ${costSchemeIdQuery} } } },
                      { status: {eq: true}}
                  ]
              }
          ) {
              items {
                  merchant {
                      merchantId
                      name
                      status
                  }
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getShopCountByMerchantIdsAndStatus(merchantIds: number[]) {
    const body = {
      query:
        `query {
          shopCountByMerchantIds (merchantIds: [${merchantIds}], status: 1) {
              id
              count
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getExistContractSKUDetails(merchantGroupId: number) {
    const body = {
      query:
        `query {
          contractSKUDetails(where: { merchantGroupId: {eq: ${merchantGroupId}}}) {
              items {
                  id
                  skuName
                  skuNumber
                  faceValueWithTax
                  skuType {
                      value
                  }
                  voucherNumberRule {
                      ruleName
                  }
                  contractSKUCosts {
                      id
                      contractId,
                      cost,
                      costWithTax,
                      costWithoutTax,
                      validStartDate
                      validEndDate
                      statusId
                  }
              }
          }
      }`
    };
    return this.http.post(this._graphQL, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  getDownload(merchantGroupId: number, utcOffset?: string) {
    let url = `${this._getURL()}api/MerchantGroup/DownloadGroupSku?MerchantGroupId=${merchantGroupId}`;
    if (utcOffset) {
      url += `&UtcOffset=${encodeURIComponent(utcOffset)}`;
    }
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()), responseType: 'blob', observe: 'response' });
  }

  getShopsByMerchantId(merchantId: number, searchTerm: string, skip: number = 0, take: number = 10) {
    const body = {
      query:
        `query {
            shops(skip: ${skip} take: ${take} order: {createdOn: DESC}
              where: {
                and: [
                    {merchantId: { eq: ${merchantId}}},
                    { or: [
                        { name: { contains: "${searchTerm}"}},
                        { identityCode: { contains: "${searchTerm}"}}
                    ]}
                ]

            }) {
                totalCount
                items {
                    shopId
                    name
                    identityCode
                    status
                    createdOn
                }
            }
        }`
    };
    return this.http.post(this._graphQL, body) as Observable<BaseResponse>;
  }

  getShopCountByMerchantIds(merchantIds: number[], status: number | null = null) {
    const statusClause = status === null ? "" : `, status: ${status}`
    const body = {
      query:
        `query{
          shopCountByMerchantIds(merchantIds : ${JSON.stringify(merchantIds)} ${statusClause})
          {
              id
              count
          }
        }`
    };

    return this.http.post(this._graphQL, body) as Observable<BaseResponse>;
  }

  createAcceptanceLoop(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantGroup/acceptanceloop`;
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  updateAcceptanceLoop(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantGroup/acceptanceloop`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  getAcceptanceLoopMerchantShops(acceptanceLoopMerchantId: number, shoIds: number[]) {
    const body = {
      query:
        `query{
          acceptanceLoopMerchantShops(where: {
              and:[
                  {acceptanceLoopMerchantId: {eq: ${acceptanceLoopMerchantId}}}
                  {shopId: {in: ${JSON.stringify(shoIds)}}}
              ]
          } skip: 0 take: 100 order: {shopId: ASC}) {
              totalCount
              items {
                  shopId
                  status
              }
          }
        }`
    };
    return this.http.post(this._graphQL, body) as Observable<BaseResponse>;
  }

  createSkuMerchantGroup(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Contract/Sku`;
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  updateSkuMerchantGroup(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Contract/Sku`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  reset() {
    this._search$.next();
  }
}
