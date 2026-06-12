import { Injectable } from '@angular/core';
import {
  Subject,
  BehaviorSubject,
  Observable,
  tap,
  debounceTime,
  switchMap,
  delay,
  map,
  of,
} from 'rxjs';
import { Order } from '../models/order.model';
import { OrderState } from '../models/order-state.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../models/base-response.model';
import { GetOrdersResp } from '../models/get-orders-response';
import { ExportOrder } from '../models/export-order.model';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { OrderLine, Product } from 'src/app/shared/models/product.model';
import {
  OrderRequest,
  UpdateOrderStatusRequest,
} from '../models/order-request.model';
import { ReasonMessage } from '../models/reason-message.model';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { ProductTemplateStateService } from './state-service/product-template-state.service';
import { ProductDTOResponse } from 'src/app/shared/models/product-dto.model';
import { OrderMode } from '../models/quotation-type.model';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { Quotation } from '../interface/quotation-state.interface';
import { FormInputTypeEnum } from 'src/app/shared/enums/form-input-type.enum';
import { ActivationTypeEnum } from 'src/app/shared/enums/activation-type.enum';
import { OrderModeEnum } from '../enums/order-mode.enum';
import * as moment from 'moment';
import { Media } from 'src/app/shared/models/media.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  MOCK_DATA: Product[] = [
    {
      id: 1,
      productVersionId: 1,
      productCode: 'IQIYMMDDXYZ',
      productName: 'Super Voucher $10,000',
      isActive: true,
      productType: ProductTypeEnum.SuperVoucher,
      issuedQuantity: 5,
      emailIssuedQuantity: 2,
      smsIssuedQuantity: 3,
      remainingQuantity: 10,
      voucherQuantity: 1,
      emailQuantity: 2,
      smsQuantity: 3,
      faceValue: 2400.0,
      sellingPrice: 2400.0,
      expiryScheme: 1,
      expirySchemeText: 'Fixed end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: false,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 2,
      productVersionId: 1,
      productCode: 'CFRVYMDDFV',
      productName: 'Carrefour {DFV}',
      isActive: true,
      productType: ProductTypeEnum.DynamicFaceValue,
      issuedQuantity: 7,
      emailIssuedQuantity: 3,
      smsIssuedQuantity: 4,
      emailQuantity: 4,
      smsQuantity: 2,
      dfvPercentage: 98.0,
      remainingQuantity: 10,
      voucherQuantity: 7,
      faceValue: 10,
      sellingPrice: 10,
      faceValueRange: '200 to 2000',
      dfvQuantity: [
        {
          voucherQuantity: 1,
          faceValue: 113,
          sellingPrice: 110.74,
        },
        {
          voucherQuantity: 2,
          faceValue: 123,
          sellingPrice: 120.54,
        },
        {
          voucherQuantity: 1,
          faceValue: 103,
          sellingPrice: 100.94,
        },
        {
          voucherQuantity: 3,
          faceValue: 112,
          sellingPrice: 109.76,
        },
      ],
      expiryScheme: 1,
      expirySchemeText: 'Fix end of day',
      expiryDate: '2999/12/31 23:59:59',
      isChildProduct: false,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 3,
      productVersionId: 1,
      productCode: 'SUPA001PQR',
      productName: 'Super Voucher $10,000',
      isActive: true,
      productType: ProductTypeEnum.SuperVoucher,
      issuedQuantity: 2,
      emailIssuedQuantity: 1,
      smsIssuedQuantity: 1,
      voucherQuantity: 1,
      remainingQuantity: 10,
      faceValue: 10000.0,
      sellingPrice: 10000.0,
      expiryScheme: 1,
      expirySchemeText: 'Fix end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: false,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 4,
      productVersionId: 1,
      productCode: 'MDNBYMMDD52PQR',
      productName: 'Sample child product #1',
      isActive: true,
      productType: ProductTypeEnum.ProductBased,
      parentCode: 'SUPA001PQR',
      expiryScheme: 1,
      expirySchemeText: 'Fix end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: true,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 5,
      productVersionId: 1,
      productCode: 'MDNBYMMDD36PQR',
      productName: 'Sample child product #2',
      isActive: true,
      productType: ProductTypeEnum.ProductBased,
      parentCode: 'SUPA001PQR',
      expiryScheme: 1,
      expirySchemeText: 'Fix end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: true,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 6,
      productVersionId: 1,
      productCode: 'TSTVE002123',
      productName: 'Issuer_Edenred_ValueBased_TestProduct',
      isActive: true,
      productType: ProductTypeEnum.ValueBased,
      parentCode: 'SUPA001PQR',
      expiryScheme: 2,
      expirySchemeText: 'Within end of 2 months expired after activation',
      isChildProduct: true,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 7,
      productVersionId: 1,
      productCode: 'TSTPRO002123',
      productName: 'Reseller_ThirdParty_ProductBased_TestProduct',
      isActive: true,
      productType: ProductTypeEnum.ProductBased,
      parentCode: 'SUPA001PQR',
      expiryScheme: 2,
      expirySchemeText:
        'Flexible deferred within end of 3 months expired after activation',
      isChildProduct: true,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 7,
      productVersionId: 1,
      productCode: 'IQIYMMDDXYZ',
      productName: 'Super Voucher $10,000',
      isActive: true,
      productType: ProductTypeEnum.SuperVoucher,
      issuedQuantity: 2,
      emailIssuedQuantity: 1,
      smsIssuedQuantity: 1,
      remainingQuantity: 10,
      voucherQuantity: 1,
      faceValue: 2400.0,
      sellingPrice: 2400.0,
      expiryScheme: 1,
      expirySchemeText: 'Fix end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: false,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
  ];

  MOCK_DATA_APPEND: Product[] = [
    {
      id: 8,
      productCode: 'WRX',
      productName: 'Super Voucher $10,000',
      productVersionId: 1,
      isActive: false,
      productType: ProductTypeEnum.SuperVoucher,
      issuedQuantity: 5,
      emailIssuedQuantity: 2,
      smsIssuedQuantity: 3,
      remainingQuantity: 10,
      voucherQuantity: 1,
      emailQuantity: 2,
      smsQuantity: 3,
      faceValue: 2400.0,
      sellingPrice: 2400.0,
      expiryScheme: 1,
      expirySchemeText: 'Fixed end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: false,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
    {
      id: 9,
      productCode: 'BRZ',
      productName: 'Super Voucher $10,000',
      productVersionId: 1,
      isActive: false,
      productType: ProductTypeEnum.SuperVoucher,
      issuedQuantity: 5,
      emailIssuedQuantity: 2,
      smsIssuedQuantity: 3,
      remainingQuantity: 10,
      voucherQuantity: 1,
      emailQuantity: 2,
      smsQuantity: 3,
      faceValue: 2400.0,
      sellingPrice: 2400.0,
      expiryScheme: 1,
      expirySchemeText: 'Fixed end of day',
      expiryDate: '2022/12/31 23:59:59',
      isChildProduct: false,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountBank: '星展銀行(履保)',
        trustAccountFee: '0.1%',
        trustAccountBatchNumber: 123456,
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
        validPeriod: [new Date().toString(), new Date().toString()],
      },
    },
  ];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _orders$ = new BehaviorSubject<Order[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _isClearDatePicker$ = new Subject<boolean>();

  today = new Date();
  fromDate = moment(this.today).subtract(365, 'days').utc().format();
  toDate = moment(this.today).add(1, 'days').utc().format();

  withOrderDetails = [OrderModeEnum.DirectNonAPI, OrderModeEnum.API];

  private _state: OrderState = {
    page: 0,
    pageSize: 20,
    searchTerm: '',
    orderStatus: 0,
    createdFrom: this.fromDate,
    createdTo: this.toDate,
    currentTab: 1,
  };

  savedProductListFile!: File;

  constructor(
    private http: HttpClient,
    private authorizationLibraryService: AuthorizationLibraryService,
    private productTemplateStateService: ProductTemplateStateService
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this.getOrders()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((res: GetOrdersResp) => {
        if (res.data) {
          const data = JSON.parse(res.data);
          this._orders$.next(data.orderByQuotationAndClient.items);
          this._total$.next(data.orderByQuotationAndClient.totalCount);
        } else {
          this._orders$.next([]);
          this._total$.next(0);
        }
      });

    this._search$.next();
  }

  get orders$() {
    return this._orders$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }
  get orderStatus() {
    return this._state.orderStatus;
  }
  get createdFrom() {
    return this._state.createdFrom;
  }
  get createdTo() {
    return this._state.createdTo;
  }
  get currentTab() {
    return this._state.currentTab;
  }
  get isClearDatePicker$() {
    return this._isClearDatePicker$.asObservable();
  }

  set page(page: number) {
    this.set({ page });
  }
  set pageSize(pageSize: number) {
    this.set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this.set({ searchTerm: searchTerm });
  }
  set orderStatus(orderStatus: number) {
    this.set({ orderStatus });
  }
  set createdFrom(createdFrom: string) {
    this.set({ createdFrom });
  }
  set createdTo(createdTo: string) {
    this.set({ createdTo });
  }
  set currentTab(currentTab: number) {
    this.set({ currentTab });
  }
  set isClearDatePicker(isClear: boolean) {
    this._isClearDatePicker$.next(isClear);
  }

  private set(patch: Partial<OrderState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  private getOrders(): Observable<BaseResponse> {
    const {
      page,
      pageSize,
      searchTerm,
      orderStatus,
      createdFrom,
      createdTo,
      currentTab,
    } = this._state;
    const url = `${this.getURL()}api/GraphQL/Query`;
    const status = orderStatus !== 0 ? `{status:{ eq : ${orderStatus}}}` : '{}';
    const pageNumber = page > 0 ? page - 1 : page;
    const pagesToSkip = pageSize * pageNumber;
    const modes =
      currentTab === 1
        ? [
            OrderModeEnum.IndirectNonAPI,
            OrderModeEnum.DirectNonAPI,
            OrderModeEnum.PaperVoucher,
          ]
        : [OrderModeEnum.API];
    const body = {
      query: `query{orderByQuotationAndClient(skip: ${pagesToSkip}, take: ${pageSize} 
          where: { 
            and: [
              { createdDateTime: { gte: "${createdFrom}" } },
              { createdDateTime:{ lte: "${createdTo}" } },
              { mode: { in: [${modes.join(',')}] } },
              { or: ${status} },
            ]
          } 
          searchKeyword: "${searchTerm}" 
          order : { createdDateTime: DESC }) 
          { totalCount 
            items {
              id,
              orderNumber,
              orderName,
              mode,
              createdDateTime,
              createdBy,
              isDirectDelivery,
              publishDateTime,
              status,
              orderLines { 
                id,
                totalQuantity
              }, 
              quotation { 
                id, 
                quotationNumber,
                status, 
                clintById {
                  clientName
                }
              }
            }
          }
        }`,
    };
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  refresh() {
    this._search$.next();
  }

  reset() {
    this._state = {
      page: 0,
      pageSize: 20,
      searchTerm: '',
      orderStatus: 1,
      createdFrom: this.fromDate,
      createdTo: this.toDate,
      currentTab: 1,
    };
  }

  exportOrder(order: ExportOrder) {
    const url = `${this.getURL()}api/Order/ExportOrder`;
    return this.http.post(url, order, { responseType: 'blob' });
  }

  // mock order
  private mockOrder: OrderRequest = {
    basicInfoFormGroup: {
      orderName: 'Demo Order Name',
      publishDate: new Date(),
      activationType: 1,
      activationDate: new Date(),
    },
    settingsFormGroup: {
      excelFormat: 1,
      excelShortUrl: 1,
      barcodeInfo: 1,
      emailAttachment: 1,
      shortUrlAuthCodeGenerationWay: 1,
      generateSequenceNumber: true,
      channelId: 1,
    },
    memoFormGroup: {
      memo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    attachmentFormGroup: {
      attachments: [
        {
          name: 'Quotation 20221222.pdf',
          lastModified: 12,
          webkitRelativePath: 'asdasd',
          size: 12,
          type: 'pdf',
        },
      ],
    },
    deliveryDetailsFormGroup: {
      emailTemplate: 'Original',
      emailSubject: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emailGreeting:
        'Tellus aliquam et ullamcorper enim consequat augue facilisis platea. Et odio pellentesque lacus, gravida pharetra.',
      msgEncoding: 1,
      smsGreeting:
        'Tellus aliquam et ullamcorper enim consequat augue facilisis platea. Et odio pellentesque lacus, gravida pharetra.',
    },
  };

  updateOrder(body: OrderRequest): void {
    this.mockOrder = body;
  }

  getProductTemplateFile(quotationNumber: string, orderMode: number) {
    const url = `${this.getURL()}api/Order/DownloadProductTemplate`;

    const body = {
      quotationNo: quotationNumber,
      orderMode: orderMode,
    };
    return this.http.post(url, body, {
      headers: this.authorizationLibraryService.getAMMHeaders(),
      responseType: 'blob',
    });
  }

  getProductList(
    quotationNumber: string,
    activationDate: string | null = '2020-01-04',
    file: File,
    orderMode: number
  ): Observable<ProductDTOResponse> {
    const url = `${this.getURL()}api/Order/ValidateUploadedProduct`;
    const formData: FormData = new FormData();
    formData.append('QuotationNumber', quotationNumber);
    if (OrderModeEnum.API !== orderMode) {
      formData.append('ActivationDate', activationDate || '');
    }
    formData.append('File', file, file.name);
    formData.append('OrderMode', orderMode.toString());

    return this.http
      .post<any>(url, formData)
      .pipe(map((response) => response as ProductDTOResponse));
  }

  getMockedProductList(): Product[] {
    return this.MOCK_DATA;
  }

  getProductListAppend(): Product[] {
    return this.MOCK_DATA_APPEND;
  }

  createOrder(
    selectedQuotation: Quotation,
    orderMode: OrderMode,
    basicInfoFormModel: FormModel,
    attachments: { attachments: File[] },
    settingsFormModel: FormModel,
    memo: { memo: string },
    orderLines: OrderLine[],
    deliveryDetails: {
      emailTemplate: string;
      emailSubject: string;
      emailGreeting: string;
      msgEncoding: string;
      smsGreeting: string;
    }
  ) {
    const url = `${this.getURL()}api/Order/Create`;
    const formData: FormData = new FormData();
    formData.append('ClientQuotationNo', selectedQuotation.quotationNumber);
    formData.append('Mode', orderMode.key.toString());

    this.prepareFirstStep(
      formData,
      basicInfoFormModel,
      attachments.attachments,
      settingsFormModel,
      memo.memo
    );

    // order lines
    this.prepareOrderLines(formData, orderLines, orderMode.key);

    // default direct delivery and API
    if (
      [OrderModeEnum.DirectNonAPI, OrderModeEnum.API].includes(orderMode.key)
    ) {
      formData.append(
        `DefaultDeliveryContent.EmailTemplateId`,
        deliveryDetails.emailTemplate
      );
      formData.append(
        `DefaultDeliveryContent.EmailSubject`,
        deliveryDetails.emailSubject
      );
      formData.append(
        `DefaultDeliveryContent.EmailGreeting`,
        deliveryDetails.emailGreeting ? deliveryDetails.emailGreeting : ''
      );
      formData.append(
        `DefaultDeliveryContent.SlmsGreeting`,
        deliveryDetails.smsGreeting ? deliveryDetails.smsGreeting : ''
      );
      formData.append(
        `DefaultDeliveryContent.MessageEncodingId`,
        deliveryDetails.msgEncoding
      );
    }

    return this.http
      .post<BaseResponse>(url, formData, {
        headers: this.authorizationLibraryService
          .getAMMHeaders()
          .delete('content-type', 'application/json'),
      })
      .pipe(map((response) => response));
  }

  prepareFirstStep(
    formData: FormData,
    basicInfoFormModel: FormModel,
    attachments: File[] | null,
    settingsFormModel: FormModel,
    memo: string
  ) {
    // basic info
    const activationType =
      basicInfoFormModel.formGroup.get('activationType')?.value;
    const afterPublished =
      basicInfoFormModel.formGroup.get('afterPublished')?.value;
    const publishDate = basicInfoFormModel.formGroup.get('publishDate')?.value;
    const hasNoTargetPublishDate = basicInfoFormModel.formGroup.get(
      'hasNoTargetPublishDate'
    )?.value;

    for (const field of basicInfoFormModel.fieldsDefinition) {
      const controlName = field.formControlName;
      let value = basicInfoFormModel.formGroup.get(controlName)?.value;

      if (field.hidden) continue;

      if (
        field.type === FormInputTypeEnum.Date &&
        field.formControlName !== 'activationDate'
      ) {
        value = value ? moment(value._d).utc().format() : '';
      }

      if (field.formControlName === 'activationDate') {
        switch (activationType) {
          case ActivationTypeEnum.NDaysFromPublishDate: {
            if (hasNoTargetPublishDate) {
              value = '';
            } else {
              value = moment(publishDate._d)
                .add(parseInt(afterPublished), 'days')
                .utc()
                .format();
            }

            break;
          }
          case ActivationTypeEnum.FixedOfDate: {
            value = moment(value._d).utc().format();
            break;
          }
          // ActivationTypeEnum.SameAsPublishDate
          // ActivationTypeEnum.Inactive
          default: {
            value = '';
            break;
          }
        }
      }

      formData.append(controlName, value);
    }

    // settings
    for (const field of settingsFormModel.fieldsDefinition) {
      const controlName = field.formControlName;
      const value = settingsFormModel.formGroup.get(controlName)?.value;

      if (field.hidden || value === null) continue;

      formData.append(controlName, value);
    }

    // memo
    formData.append('memo', memo);

    // attachments
    if (attachments && attachments.length) {
      for (const attachment of attachments) {
        formData.append('attachments', attachment);
      }
    }
  }

  prepareOrderLines(
    formData: FormData,
    orderLines: OrderLine[],
    orderMode: OrderModeEnum
  ) {
    for (const [index, product] of orderLines.entries()) {
      formData.append(
        `OrderLines[${index}][ProductVersionId]`,
        product.productVersionId.toString()
      );
      formData.append(
        `OrderLines[${index}][ExpirationPolicyId]`,
        product.expirationPolicyId.toString()
      );
      formData.append(
        `OrderLines[${index}][ExpiryDate]`,
        product.expiryDate ? product.expiryDate.toString() : ''
      );
      formData.append(
        `OrderLines[${index}][TotalQuantity]`,
        product.totalQuantity.toString()
      );
      formData.append(
        `OrderLines[${index}][VoucherReservationCode]`,
        product.voucherReservationCode.toString()
      );
      formData.append(
        `OrderLines[${index}][ClientOrderNo]`,
        product.clientOrderNo.toString()
      );
      formData.append(
        `OrderLines[${index}][NeedShortUrl]`,
        product.needShortUrl.toString()
      );

      // trust account pending integration
      formData.append(`OrderLines[${index}][NeedTrustAccount]`, 'false');

      // for direct mode else 0 value
      formData.append(
        `OrderLines[${index}][EmailQuantity]`,
        product.emailQuantity?.toString() ?? '0'
      );
      formData.append(
        `OrderLines[${index}][SlmsQuantity]`,
        product.slmsQuantity?.toString() ?? '0'
      );

      // for DFV
      if (product.dfvProductDetails.length) {
        for (const [dfvIndex, dfv] of product.dfvProductDetails.entries()) {
          formData.append(
            `OrderLines[${index}].DfvProductDetails[${dfvIndex}][FaceValueWithTax]`,
            dfv.faceValueWithTax.toString()
          );
          formData.append(
            `OrderLines[${index}].DfvProductDetails[${dfvIndex}][VoucherQuantity]`,
            dfv.voucherQuantity.toString()
          );
        }
      }

      // for trust account
      if (product.needTrustAccount && product.trustAccount) {
        const trustAcc = product.trustAccount;
        formData.append(
          `OrderLines[${index}][TrustAccountId]`,
          trustAcc.trustAccountId?.toString()
        );
        formData.append(
          `OrderLines[${index}][TrustAccountFee]`,
          trustAcc.trustAccountFee ? trustAcc.trustAccountFee.toString() : ''
        );
        formData.append(
          `OrderLines[${index}][TrustAccountBatchNumber]`,
          trustAcc.trustAccountBatchNumber
            ? trustAcc.trustAccountBatchNumber.toString()
            : ''
        );
        formData.append(
          `OrderLines[${index}][TrustAccountOptionId]`,
          trustAcc.trustAccountOptionId
            ? trustAcc.trustAccountOptionId?.toString()
            : '0'
        );
        formData.append(
          `OrderLines[${index}][TrustAmount]`,
          trustAcc.trustAmount ? trustAcc.trustAmount.toString() : ''
        );
        formData.append(
          `OrderLines[${index}][TrustExpirySchemeId]`,
          trustAcc.trustExpirySchemeId
            ? trustAcc.trustExpirySchemeId.toString()
            : ''
        );
        formData.append(
          `OrderLines[${index}][TrustExpiryDate]`,
          trustAcc.trustExpiryDate ? trustAcc.trustExpiryDate.toString() : ''
        );
        formData.append(
          `OrderLines[${index}][TrustExpiryDateType]`,
          trustAcc.trustExpiryDateType
            ? trustAcc.trustExpiryDateType.toString()
            : ''
        );
      }

      // for beneficiaries
      if (
        this.withOrderDetails.includes(orderMode) &&
        product.orderLineDetails.length
      ) {
        for (const [olIndex, orderLine] of product.orderLineDetails.entries()) {
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][BeneficiaryName]`,
            orderLine.beneficiaryName
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][Email]`,
            orderLine.email
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][Mobile]`,
            orderLine.mobile
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][FaceValue]`,
            orderLine.faceValue ? orderLine.faceValue.toString() : ''
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][VoucherQuantity]`,
            orderLine.voucherQuantity
              ? orderLine.voucherQuantity.toString()
              : orderMode === OrderModeEnum.API
              ? '0'
              : ''
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][EDOrderNo]`,
            orderLine.edOrderNo
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][PostCode]`,
            orderLine.postCode
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][Address]`,
            orderLine.address
          );
          formData.append(
            `OrderLines[${index}].OrderLineDetails[${olIndex}][Language]`,
            orderLine.language
          );
        }
      }

      if (this.productTemplateStateService.productTemplateList.length) {
        const getProductTemplate =
          this.productTemplateStateService.productTemplateList.find(
            (templateList) =>
              templateList.productVersionId === product.productVersionId
          );

        if (getProductTemplate) {
          let currentContentIndex = 0;
          if (
            getProductTemplate.voucherTemplate &&
            getProductTemplate.voucherTemplate.productTemplateVersion
          ) {
            getProductTemplate.voucherTemplate.productTemplateVersion.forEach(
              (templateVersion) => {
                formData.append(
                  `OrderLines[${index}].ContentList[${currentContentIndex}][TemplateVersionId]`,
                  templateVersion.templateVersionId.toString()
                );

                formData.append(
                  `OrderLines[${index}].ContentList[${currentContentIndex}][TemplateType]`,
                  getProductTemplate.voucherTemplate!.type.toString()
                );

                formData.append(
                  `OrderLines[${index}].ContentList[${currentContentIndex}][TemplateSubType]`,
                  getProductTemplate.voucherTemplate!.subType!.toString()
                );

                templateVersion.templateTagValue.forEach(
                  (tagValue, tagIndex) => {
                    formData.append(
                      `OrderLines[${index}].ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagId]`,
                      tagValue.tagId.toString()
                    );

                    // MEDIA
                    let value = '';
                    if (
                      tagValue.value &&
                      (tagValue.value as unknown as Media).nodeUrl
                    ) {
                      value = (
                        tagValue.value as unknown as Media
                      ).mediaId.toString();
                    } else {
                      value = tagValue.value ? tagValue.value.toString() : '';
                    }

                    formData.append(
                      `OrderLines[${index}].ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagValue]`,
                      value
                    );
                  }
                );

                currentContentIndex++;
              }
            );
          }

          if (
            getProductTemplate.smsTemplate &&
            getProductTemplate.smsTemplate.productTemplateVersion
          ) {
            getProductTemplate.smsTemplate.productTemplateVersion.forEach(
              (templateVersion) => {
                formData.append(
                  `OrderLines[${index}].ContentList[${currentContentIndex}][TemplateVersionId]`,
                  templateVersion.templateVersionId.toString()
                );

                formData.append(
                  `OrderLines[${index}].ContentList[${currentContentIndex}][TemplateType]`,
                  getProductTemplate?.smsTemplate!.type.toString()
                );

                formData.append(
                  `OrderLines[${index}].ContentList[${currentContentIndex}][TemplateSubType]`,
                  getProductTemplate?.smsTemplate!.subType!.toString()
                );

                templateVersion.templateTagValue.forEach(
                  (tagValue, tagIndex) => {
                    formData.append(
                      `OrderLines[${index}].ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagId]`,
                      tagValue.tagId.toString()
                    );

                    formData.append(
                      `OrderLines[${index}].ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagValue]`,
                      tagValue.value ? tagValue.value.toString() : ''
                    );
                  }
                );

                currentContentIndex++;
              }
            );
          }
        }
      }
    }
  }

  updateOrderStatus(body: UpdateOrderStatusRequest) {
    const url = `${this.getURL()}api/Order/Status`;
    return this.http.patch(url, body) as Observable<BaseResponse>;
  }

  updateOrderLineStatus(orderId: number, orderLineIds: number[], status = 1) {
    const url = `${this.getURL()}api/Order/OrderLine`;
    const body = {
      orderId,
      orderLineIds,
      status: status.toString(),
    };
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  getOrderById(id: number) {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `query Orders {
                orders(where: {id: {eq: ${id}}}) { items {
                  id
                  clientQuotationId
                  clientId
                  orderNumber
                  mode
                  isDirectDelivery
                  publishDateTime
                  status
                  executingStatus
                  executingResponse
                  packageReceiver
                  packagePassword
                  orderName
                  shortUrlAuthCodeGenerationWay
                  indirectFileFormat
                  mwvEmailTemplateId
                  exportBarcodeInfo
                  voucherSupplierId
                  packagePinReceiver
                  emailAttachShortUrlImageId
                  urlType
                  generateSequenceNumber
                  memo
                  orderActivateMode
                  afterPublished
                  fixedDate
                  emailGreeting
                  emailSubject
                  smsGreeting
                  createdDateTime
                  orderLines {
                      id
                      status
                      orderId
                      totalQuantity
                      emailQuantity
                      smsQuantity
                      defaultExpirationDate
                      voucherReservationCode
                      needShortUrl
                      expirationPolicyId
                      messageEncoding
                      publishedQuantity
                      needTrustAccount
                      productVersionId
                      productVersion {
                        productVersionId
                        skuId
                        product {
                          productCode
                          productName
                          productType
                          isMaster
                        }
                      }
                      orderLineTemplateId
                      orderLineTemplate {
                        orderLineTemplateSet {
                            orderLineTemplateSetId
                            templateType
                            templateSubType
                            orderLineTemplateVersionId
                            orderLineTemplateVersion {
                                templateVersionId
                                orderLineTemplateTagValue {
                                    orderLineTemplateTagValueId
                                    orderLineTemplateTagValueSet {
                                        orderLineTemplateTagSetId
                                        tagId
                                        value
                                      }
                                  }
                              }
                          }
                      }
                      orderLineDetails {
                          id
                          orderLineId
                          voucherId
                          mobile
                          email
                          activeDate
                          expirySchemeId
                          expiryDate
                          eDOrderNumber
                          memo
                          name
                          address
                          postCode
                          languageId
                          clientOrderNumber
                          faceValue
                          faceValueWithTax
                          soldPrice
                          soldPriceWithTax
                          isEmailDelivered
                          isSmsDelivered
                      }
                  }
                  orderChannelId
              }
          }
        }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.orders?.items[0];
        }
      })
    );
  }

  getOrderLineDetail(orderId: number, orderLineId: number) {
    const url = `${this.getURL()}api/Order/OrderLineDetailFromExcel?OrderId=${orderId}&OrderLineId=${orderLineId}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  getOrderRemainingQuantity(quotationId: number) {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `{
        orderQuotationServedQuantities(where: {quotationId: {eq: ${quotationId}}}) {
          items {
            id
            quotationId
            productVersionId
            remainingQuantity
          }
        }
      }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.orderQuotationServedQuantities
            ?.items;
        }
      })
    );
  }

  updateOrderBasicInfo(orderId: number, memo: string) {
    const formData = new FormData();
    formData.append('Id', orderId?.toString());
    formData.append('Memo', memo);
    const url = `${this.getURL()}api/Order/BasicInfo/${orderId}`;
    return this.http.put(url, formData) as Observable<BaseResponse>;
  }

  batchUpdateOrderLine(
    orderId: number,
    orderLineData: OrderLine[],
    deleteAll: boolean
  ) {
    const formData = new FormData();
    formData.append('Id', orderId?.toString());
    formData.append('DeleteAll', deleteAll?.toString());
    this.prepareOrderLinesForUpdate(formData, orderLineData);
    const url = `${this.getURL()}api/Order/OrderLine/${orderId}`;
    return this.http.put(url, formData) as Observable<BaseResponse>;
  }

  prepareOrderLinesForUpdate(formData: FormData, orderLineData: OrderLine[]) {
    for (const [index, product] of orderLineData.entries()) {
      formData.append(
        `OrderLinesCreated[${index}][ProductVersionId]`,
        product.productVersionId.toString()
      );
      formData.append(
        `OrderLinesCreated[${index}][ExpirationPolicyId]`,
        product.expirationPolicyId.toString()
      );
      formData.append(
        `OrderLinesCreated[${index}][ExpiryDate]`,
        product.expiryDate ? product.expiryDate.toString() : ''
      );
      formData.append(
        `OrderLinesCreated[${index}][TotalQuantity]`,
        product.totalQuantity.toString()
      );
      formData.append(
        `OrderLinesCreated[${index}][VoucherReservationCode]`,
        product.voucherReservationCode.toString()
      );
      formData.append(
        `OrderLinesCreated[${index}][ClientOrderNo]`,
        product.clientOrderNo.toString()
      );
      formData.append(
        `OrderLinesCreated[${index}][NeedShortUrl]`,
        product.needShortUrl.toString()
      );
      formData.append(
        `OrderLinesCreated[${index}][NeedTrustAccount]`,
        product.needTrustAccount.toString()
      );

      // for direct mode else 0 value
      formData.append(
        `OrderLinesCreated[${index}][EmailQuantity]`,
        product.emailQuantity?.toString() ?? '0'
      );
      formData.append(
        `OrderLinesCreated[${index}][SlmsQuantity]`,
        product.smsQuantity?.toString() ?? '0'
      );

      // orderLineDetails
      if (product.orderLineDetails?.length) {
        for (const [
          lineDetailsIndex,
          lineDetail,
        ] of product.orderLineDetails.entries()) {
          formData.append(
            `OrderLinesCreated[${index}].OrderLineDetails[${lineDetailsIndex}][VoucherQuantity]`,
            lineDetail.voucherQuantity.toString()
          );
          formData.append(
            `OrderLinesCreated[${index}].OrderLineDetails[${lineDetailsIndex}][FaceValue]`,
            lineDetail.faceValue.toString()
          );
          formData.append(
            `OrderLinesCreated[${index}].OrderLineDetails[${lineDetailsIndex}][ExpirySchemeId]`,
            lineDetail.expirySchemeId.toString()
          );
        }
      }

      // for DFV
      if (product.dfvProductDetails?.length) {
        for (const [dfvIndex, dfv] of product.dfvProductDetails.entries()) {
          formData.append(
            `OrderLinesCreated[${index}].DfvProductDetails[${dfvIndex}][FaceValueWithTax]`,
            dfv.faceValueWithTax.toString()
          );
          formData.append(
            `OrderLinesCreated[${index}].DfvProductDetails[${dfvIndex}][VoucherQuantity]`,
            dfv.voucherQuantity.toString()
          );
        }
      }
    }
  }

  saveTemporaryFile(inputfile: File) {
    this.savedProductListFile = inputfile;
  }

  getSavedTemporaryFile() {
    return this.savedProductListFile;
  }

  updateOrderLineTemplate(
    orderTemplateId: number,
    productVersionId: number
  ): Observable<BaseResponse> {
    const url = `${this.getURL()}api/Order/OrderTemplate/${orderTemplateId}`;
    const formData = new FormData();
    formData.append('OrderLineTemplateId', orderTemplateId.toString());

    if (this.productTemplateStateService.productTemplateList.length) {
      const getProductTemplate =
        this.productTemplateStateService.productTemplateList.find(
          (templateList) => templateList.productVersionId === productVersionId
        );

      if (getProductTemplate) {
        let currentContentIndex = 0;
        if (
          getProductTemplate.voucherTemplate &&
          getProductTemplate.voucherTemplate.productTemplateVersion
        ) {
          getProductTemplate.voucherTemplate.productTemplateVersion.forEach(
            (templateVersion) => {
              formData.append(
                `ContentList[${currentContentIndex}][TemplateVersionId]`,
                templateVersion.templateVersionId.toString()
              );

              formData.append(
                `ContentList[${currentContentIndex}][TemplateType]`,
                getProductTemplate.voucherTemplate!.type.toString()
              );

              formData.append(
                `ContentList[${currentContentIndex}][TemplateSubType]`,
                getProductTemplate.voucherTemplate!.subType!.toString()
              );

              templateVersion.templateTagValue.forEach((tagValue, tagIndex) => {
                formData.append(
                  `ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagId]`,
                  tagValue.tagId.toString()
                );

                // MEDIA
                let value = '';
                if (
                  tagValue.value &&
                  (tagValue.value as unknown as Media).nodeUrl
                ) {
                  value = (
                    tagValue.value as unknown as Media
                  ).mediaId.toString();
                } else {
                  value = tagValue.value ? tagValue.value.toString() : '';
                }

                formData.append(
                  `ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagValue]`,
                  value
                );
              });

              currentContentIndex++;
            }
          );
        }

        if (
          getProductTemplate.smsTemplate &&
          getProductTemplate.smsTemplate.productTemplateVersion
        ) {
          getProductTemplate.smsTemplate.productTemplateVersion.forEach(
            (templateVersion) => {
              formData.append(
                `ContentList[${currentContentIndex}][TemplateVersionId]`,
                templateVersion.templateVersionId.toString()
              );

              formData.append(
                `ContentList[${currentContentIndex}][TemplateType]`,
                getProductTemplate?.smsTemplate!.type.toString()
              );

              formData.append(
                `ContentList[${currentContentIndex}][TemplateSubType]`,
                getProductTemplate?.smsTemplate!.subType!.toString()
              );

              templateVersion.templateTagValue.forEach((tagValue, tagIndex) => {
                formData.append(
                  `ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagId]`,
                  tagValue.tagId.toString()
                );

                formData.append(
                  `ContentList[${currentContentIndex}][ContentTags][${tagIndex}][ContentTagValue]`,
                  tagValue.value ? tagValue.value.toString() : ''
                );
              });

              if (templateVersion.content1) {
                formData.append(
                  `ContentList[${currentContentIndex}][Content1]`,
                  templateVersion.content1
                );
              }

              if (templateVersion.content2) {
                formData.append(
                  `ContentList[${currentContentIndex}][Content2]`,
                  templateVersion.content2
                );
              }

              if (templateVersion.content3) {
                formData.append(
                  `ContentList[${currentContentIndex}][Content3]`,
                  templateVersion.content3
                );
              }

              currentContentIndex++;
            }
          );
        }
      }
    }
    return this.http.put(url, formData) as Observable<BaseResponse>;
  }

  updateDefDelContent(
    orderId: number,
    deliveryDetails: {
      emailTemplate: string;
      emailSubject: string;
      emailGreeting: string;
      msgEncoding: string;
      smsGreeting: string;
    }
  ) {
    const url = `${this.getURL()}api/Order/UpdateOrderDefaultDeliveryContent`;
    const formData: FormData = new FormData();
    formData.append('OrderId', orderId.toString());
    // default direct delivery
    formData.append(
      `DefaultDeliveryContent.EmailTemplateId`,
      deliveryDetails.emailTemplate
    );
    formData.append(
      `DefaultDeliveryContent.EmailSubject`,
      deliveryDetails.emailSubject
    );
    formData.append(
      `DefaultDeliveryContent.EmailGreeting`,
      deliveryDetails.emailGreeting ? deliveryDetails.emailGreeting : ''
    );
    formData.append(
      `DefaultDeliveryContent.SlmsGreeting`,
      deliveryDetails.smsGreeting ? deliveryDetails.smsGreeting : ''
    );
    formData.append(
      `DefaultDeliveryContent.MessageEncodingId`,
      deliveryDetails.msgEncoding
    );
    return this.http.put(url, formData) as Observable<BaseResponse>;
  }
}
