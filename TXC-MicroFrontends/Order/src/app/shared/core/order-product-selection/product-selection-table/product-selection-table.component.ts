import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { TableModel } from 'src/app/shared/models/dumb-models/table.model';
import { Product } from 'src/app/shared/models/product.model';
import { TrustAccountModalComponent } from '../trust-account-modal/trust-account-modal.component';
import { BusinessUnitEnum } from 'src/app/shared/enums/tenant.enum';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { TemplateService } from 'src/app/order/services/template.service';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import { ProductTemplateStateService } from 'src/app/order/services/state-service/product-template-state.service';
import {
  ReplaySubject,
  switchMap,
  take,
  map,
  takeUntil,
  of,
  forkJoin,
} from 'rxjs';
import { CurrentProductTemplates } from 'src/app/order/interface/product-template-state.interface';
import { environment } from 'src/environments/environment';
import { OrderStatusEnum } from 'src/app/order/enums/order-status.enum';
import {
  TagValue,
  Template,
  TemplateVersion,
} from 'src/app/shared/models/template.model';
import { BaseResponse } from 'src/app/order/models/base-response.model';
import { OrderLineTemplateSet } from 'src/app/order/models/order.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-selection-table',
  templateUrl: './product-selection-table.component.html',
  styleUrls: ['./product-selection-table.component.scss'],
})
export class ProductSelectionTableComponent implements OnInit, OnDestroy {
  @Input() tableModel!: TableModel;
  @Input() productList: Product[] = [];
  @Input() showChildProduct = false;
  @Input() viewMode: boolean = false;
  @Input() displaySearchBar: boolean = false;
  @Input() showActionColumn: boolean = true;
  @Input() disableEditOnTrustAccount: boolean = false;
  @Input() isDirectOrderDeliveryDetails: boolean = false;
  @Input() showViewDirectDeliveryDetails: boolean = false;
  @Input() orderStatus: OrderStatusEnum = OrderStatusEnum.Created;
  @Input() enableForCreatorOnly: boolean = false;
  @Input() isViewOnlyTrustAccount: boolean = false;
  @Input() deliveryDetailsFormGroup!: FormGroup;
  @Output() productEditClicked: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() productDeleted: EventEmitter<Product[]> = new EventEmitter<
    Product[]
  >();
  @Output() editDeliveryDetailsClicked: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() directDeliveryDetailsClicked: EventEmitter<Product> =
    new EventEmitter<Product>();
  @Output() statusChanged: EventEmitter<{
    orderLineId: number;
    status: number;
  }> = new EventEmitter<{ orderLineId: number; status: number }>();

  get editLabel() {
    return this.selectedOrderMode?.key === OrderModeEnum.IndirectNonAPI
      ? 'Edit voucher page'
      : 'Edit delivery content';
  }

  get isWithPreviewVoucherPage() {
    return this.withPreviewVoucherPage.includes(this.selectedOrderMode?.key);
  }

  get isWithPreviewSMS() {
    return this.withPreviewSMS.includes(this.selectedOrderMode?.key);
  }

  get isPublishedApi() {
    return (
      this.orderStatus === this.orderStatuses.Published &&
      this.selectedOrderMode?.key === this.orderModes.API
    );
  }

  get isWithViewDirectDeliveryDetails() {
    return this.directDeliveryDetailsOrderTypes.includes(
      this.selectedOrderMode?.key
    );
  }

  get isWithClientOrderNo() {
    return this.withClientOrderNo.includes(this.selectedOrderMode?.key);
  }

  orderStatuses = OrderStatusEnum;
  selectedTenant!: string;
  originalProductList: Product[] = [];
  noData = false;
  trustAccountEditMode: boolean = false;
  orderModes = OrderModeEnum;
  selectedOrderMode!: OrderMode;
  withPreviewVoucherPage = [
    OrderModeEnum.IndirectNonAPI,
    OrderModeEnum.DirectNonAPI,
    OrderModeEnum.API,
  ];
  withPreviewSMS = [OrderModeEnum.DirectNonAPI, OrderModeEnum.API];
  withClientOrderNo = [
    OrderModeEnum.IndirectNonAPI,
    OrderModeEnum.PaperVoucher,
  ];
  tenantEnum = BusinessUnitEnum;
  productTypeEnum = ProductTypeEnum;

  // Flag for disabling single upload for MVP
  disableSingleUpload = environment.isMvp;
  directDeliveryDetailsOrderTypes = [
    this.orderModes.DirectNonAPI,
    this.orderModes.API,
  ];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private modalService: NgbModal,
    private quotationStateService: QuotationStateService,
    private templateService: TemplateService,
    private templateStateService: ProductTemplateStateService
  ) {}

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    this.setSelectedQuotationType();
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }

    this.originalProductList = [...this.productList];
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => (this.selectedOrderMode = orderMode)
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.productList = [...this.originalProductList];
  }

  getProductDfvProps(props: any, orderMode?: OrderModeEnum) {
    // TODO: uncomment after MVP
    // if (orderMode === OrderModeEnum.DirectNonAPI) {
    //   return props.directDeliveryDetails;
    // }

    return props.dfvQuantity;
  }

  onProductEditClick(id: number): void {
    this.productEditClicked.emit(id);
  }

  onEditDeliveryDetailsClicked(product: Product, event: Event): void {
    window.scroll(0, 0);
    event.preventDefault();

    if (
      !this.templateStateService.productTemplateList.some(
        (productTemplate) =>
          productTemplate.productVersionId === product.productVersionId
      ) || 
      product.isEditMode
    ) {
      this.getTemplate(product, TemplateTypeEnum.Email, false);
      return;
    }

    this.editDeliveryDetailsClicked.emit(product.productVersionId);
    this.templateStateService.setProductTemplatesByProductVersionId(
      product.productVersionId,
      product.orderLineTemplateId
    );
  }

  onProductDelete(index: number): void {
    this.productDeleted.emit(this.productList.splice(index, 1));
  }

  onOpenTrustAccount(product: Product): void {
    const modalRef = this.modalService.open(TrustAccountModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.product = product;
    modalRef.componentInstance.disableEditOnTrustAccount =
      this.disableEditOnTrustAccount;
    modalRef.componentInstance.editMode = this.trustAccountEditMode;
    modalRef.componentInstance.isViewOnlyTrustAccount =
      this.isViewOnlyTrustAccount;
    modalRef.dismissed.subscribe((res: boolean) => {
      if (!this.trustAccountEditMode) {
        this.trustAccountEditMode = res;
      }
    });
    return;
  }

  onOpenDirectDeliveryDetails(product: Product) {
    this.directDeliveryDetailsClicked.emit(product);
  }

  onSearch($event: any) {
    const keyword = $event.target.value.toLowerCase();
    if (keyword) {
      this.productList = [
        ...this.originalProductList.filter(
          (product) =>
            product.productCode.toLowerCase().includes(keyword) ||
            product.productName.toLowerCase().includes(keyword)
        ),
      ];
    } else {
      this.productList = [...this.originalProductList];
    }
    this.noData = !!!this.productList.length;
  }

  showPreview(type: number, product: Product, event: Event) {
    event.preventDefault();

    if (
      !this.templateStateService.productTemplateList.some(
        (productTemplate) =>
          productTemplate.productVersionId === product.productVersionId
      )
    ) {
      this.getTemplate(product, type, true);
    } else {
      this.previewTemplate(product, type);
    }
  }

  getTemplate(product: Product, type: number, isPreview = false) {
    if (!product.isEditMode) {
      this.templateService
        .getProductTemplate(product.id, TemplateTypeEnum.Email)
        .pipe(
          // merge EMAIL and SMS product template
          switchMap((emailResponse: BaseResponse) => {
            return this.templateService
              .getProductTemplate(product.id, TemplateTypeEnum.SMS)
              .pipe(
                map((smsResponse: BaseResponse) => {
                  return {
                    emailTemplate: emailResponse.success
                      ? {
                          ...(emailResponse.data
                            .productTemplate[0] as Template),
                        }
                      : null,
                    smsTemplate: smsResponse.success
                      ? {
                          ...(smsResponse.data.productTemplate[0] as Template),
                        }
                      : null,
                  };
                })
              );
          }),
          // get full details of selected EMAIL AND SMS product templates
          switchMap(
            (productTemplate: {
              emailTemplate: Template | null;
              smsTemplate: Template | null;
            }) => {
              let defaultEmailVersion;
              if (productTemplate.emailTemplate) {
                defaultEmailVersion =
                  productTemplate.emailTemplate.productTemplateVersion?.find(
                    (version) =>
                      version.languageId ===
                      productTemplate.emailTemplate!.defaultLanguageId
                  );
              }

              const getEmail = productTemplate.emailTemplate
                ? this.templateService.getTemplateFullDetails(
                    productTemplate.emailTemplate,
                    TemplateTypeEnum.Email,
                    productTemplate.emailTemplate.productTemplateVersion,
                    defaultEmailVersion?.templateTagValue ?? []
                  )
                : of(null);

              return getEmail.pipe(
                switchMap((emailTemplate: Template | null) => {
                  let defaultSMSVersion;
                  if (productTemplate.smsTemplate) {
                    defaultSMSVersion =
                      productTemplate.smsTemplate.productTemplateVersion?.find(
                        (version) =>
                          version.languageId ===
                          productTemplate.smsTemplate!.defaultLanguageId
                      );
                  }

                  const getSMS = productTemplate.smsTemplate
                    ? this.templateService.getTemplateFullDetails(
                        productTemplate.smsTemplate,
                        TemplateTypeEnum.SMS,
                        productTemplate.smsTemplate.productTemplateVersion,
                        defaultSMSVersion?.templateTagValue ?? []
                      )
                    : of(null);

                  return getSMS.pipe(
                    map((smsTemplate: Template | null) => {
                      return {
                        emailTemplate: emailTemplate,
                        smsTemplate: smsTemplate,
                      };
                    })
                  );
                })
              );
            }
          )
        )
        .subscribe({
          next: (productTemplate: any) => {
            this.templateStateService.setProductTemplatesByProductVersionId(
              product.productVersionId,
              product.orderLineTemplateId ?? null,
              productTemplate.emailTemplate
                ? {
                    ...productTemplate.emailTemplate,
                    keyword: productTemplate.emailTemplate
                      ? productTemplate.emailTemplate.templateName
                      : '',
                  }
                : null,
              productTemplate.emailTemplate
                ? {
                    ...productTemplate.emailTemplate,
                    keyword: productTemplate.emailTemplate
                      ? productTemplate.emailTemplate.templateName
                      : '',
                  }
                : null,
              productTemplate.smsTemplate
                ? {
                    ...productTemplate.smsTemplate,
                    keyword: productTemplate.smsTemplate
                      ? productTemplate.smsTemplate.templateName
                      : '',
                  }
                : null,
              productTemplate.smsTemplate
                ? {
                    ...productTemplate.smsTemplate,
                    keyword: productTemplate.smsTemplate
                      ? productTemplate.smsTemplate.templateName
                      : '',
                  }
                : null,
              true
            );

            if (isPreview) {
              this.previewTemplate(product, type);
            } else {
              this.editDeliveryDetailsClicked.emit(product.productVersionId);
            }
          },
          error: () => {},
        });

      return;
    }

    const emailTemplateVersionIds =
      product.orderLineTemplate?.orderLineTemplateSet
        .filter(
          (templateSet) => templateSet.templateType === TemplateTypeEnum.Email
        )
        .map((templateSet) => {
          return templateSet.orderLineTemplateVersion.templateVersionId;
        });
    const smsTemplateVersionIds =
      product.orderLineTemplate?.orderLineTemplateSet
        .filter(
          (templateSet) => templateSet.templateType === TemplateTypeEnum.SMS
        )
        .map((templateSet) => {
          return templateSet.orderLineTemplateVersion.templateVersionId;
        });

    const getEmail = this.templateService.getTemplateByVersionIds(
      emailTemplateVersionIds ?? [],
      TemplateTypeEnum.Email
    );

    const getSMS = this.templateService.getTemplateByVersionIds(
      smsTemplateVersionIds ?? [],
      TemplateTypeEnum.SMS
    );

    of([])
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(() => {
          return forkJoin([getEmail, getSMS]);
        })
      )
      .subscribe((templates) => {
        const defaultEmailTemplate = templates[0].find(
          (template) => template.defaultLanguage === template.languageId
        );
        const defaultSMSTemplate = templates[1].find(
          (template) => template.defaultLanguage === template.languageId
        );

        const emailProductTemplateVersion =
          product.orderLineTemplate?.orderLineTemplateSet
            .filter((templateSet) => {
              return emailTemplateVersionIds?.includes(
                templateSet.orderLineTemplateVersion.templateVersionId
              );
            })
            .map((templateSet: OrderLineTemplateSet) => {
              const templateVersionId =
                templateSet.orderLineTemplateVersion.templateVersionId;
              return {
                templateVersionId:
                  templateSet.orderLineTemplateVersion.templateVersionId,
                defaultLanguageId: defaultEmailTemplate?.languageId,
                languageId: templates[0].find(
                  (template) => template.templateVersionId === templateVersionId
                )?.languageId,
                templateTagValue:
                  templateSet
                  .orderLineTemplateVersion
                  .orderLineTemplateTagValue
                  .orderLineTemplateTagValueSet.map(
                    (tagValue) => {
                      return {
                        tagId: tagValue.tagId,
                        value: tagValue.value,
                      } as unknown as TagValue;
                    }
                  ),
              };
            });

        const smsProductTemplateVersion =
          product.orderLineTemplate?.orderLineTemplateSet
            .filter((templateSet) => {
              return smsTemplateVersionIds?.includes(
                templateSet.orderLineTemplateVersion.templateVersionId
              );
            })
            .map((templateSet: OrderLineTemplateSet) => {
              const templateVersionId =
                templateSet.orderLineTemplateVersion.templateVersionId;
              return {
                templateVersionId:
                  templateSet.orderLineTemplateVersion.templateVersionId,
                defaultLanguageId: defaultSMSTemplate?.languageId,
                languageId: templates[1].find(
                  (template) => template.templateVersionId === templateVersionId
                )?.languageId,
                templateTagValue:
                  templateSet
                  .orderLineTemplateVersion
                  .orderLineTemplateTagValue
                  .orderLineTemplateTagValueSet.map(
                    (tagValue) => {
                      return {
                        tagId: tagValue.tagId,
                        value: tagValue.value,
                      } as unknown as TagValue;
                    }
                  ),
              };
            });

        if (defaultEmailTemplate) {
          defaultEmailTemplate.templateTagValue =
            emailProductTemplateVersion?.find(
              (template) => template.defaultLanguageId === template.languageId
            )?.templateTagValue;
          defaultEmailTemplate.productTemplateVersion =
            emailProductTemplateVersion as TemplateVersion[];
        }

        if (defaultSMSTemplate) {
          defaultSMSTemplate.templateTagValue = smsProductTemplateVersion?.find(
            (template) => template.defaultLanguageId === template.languageId
          )?.templateTagValue;
          defaultSMSTemplate.productTemplateVersion =
            smsProductTemplateVersion as TemplateVersion[];
        }

        const getEmailTemplateFullDetails = defaultEmailTemplate
          ? this.templateService.getTemplateFullDetails(
              defaultEmailTemplate!,
              TemplateTypeEnum.Email,
              defaultEmailTemplate?.productTemplateVersion,
              defaultEmailTemplate?.templateTagValue ?? []
            )
          : of(null);

        const getSMSTemplateFullDetails = defaultSMSTemplate
          ? this.templateService.getTemplateFullDetails(
              defaultSMSTemplate!,
              TemplateTypeEnum.SMS,
              defaultSMSTemplate?.productTemplateVersion,
              defaultSMSTemplate?.templateTagValue ?? []
            )
          : of(null);

        getEmailTemplateFullDetails
          .pipe(
            switchMap((emailTemplate: Template | null) => {
              return getSMSTemplateFullDetails.pipe(
                map((smsTemplate: Template | null) => {
                  return {
                    emailTemplate: emailTemplate,
                    smsTemplate: smsTemplate,
                  };
                })
              );
            })
          )
          .subscribe({
            next: (productTemplate: any) => {
              this.templateStateService.setProductTemplatesByProductVersionId(
                product.productVersionId,
                product.orderLineTemplateId ?? null,
                productTemplate.emailTemplate
                  ? {
                      ...productTemplate.emailTemplate,
                      keyword: productTemplate.emailTemplate
                        ? productTemplate.emailTemplate.templateName
                        : '',
                    }
                  : null,
                productTemplate.emailTemplate
                  ? {
                      ...productTemplate.emailTemplate,
                      keyword: productTemplate.emailTemplate
                        ? productTemplate.emailTemplate.templateName
                        : '',
                    }
                  : null,
                productTemplate.smsTemplate
                  ? {
                      ...productTemplate.smsTemplate,
                      keyword: productTemplate.smsTemplate
                        ? productTemplate.smsTemplate.templateName
                        : '',
                    }
                  : null,
                productTemplate.smsTemplate
                  ? {
                      ...productTemplate.smsTemplate,
                      keyword: productTemplate.smsTemplate
                        ? productTemplate.smsTemplate.templateName
                        : '',
                    }
                  : null,
                true
              );

              if (isPreview) {
                this.previewTemplate(product, type);
              } else {
                this.editDeliveryDetailsClicked.emit(product.productVersionId);
              }
            },
            error: () => {},
          });
      });
  }

  previewTemplate(product: Product, type: number) {
    this.templateStateService.productTemplates$
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe({
        next: (productTemplateState: CurrentProductTemplates) => {
          const productTemplate = productTemplateState.productTemplates.find(
            (productTemplate) =>
              productTemplate.productVersionId === product.productVersionId
          );

          if (productTemplate?.voucherTemplate?.defaultTemplateVersion) {
            this.applyVoucherPageDefaultValues(
              productTemplate?.voucherTemplate?.defaultTemplateVersion
            );
          }

          if (productTemplate?.smsTemplate?.defaultTemplateVersion) {
            this.applySMSDefaultValues(
              productTemplate?.smsTemplate?.defaultTemplateVersion
            );
          }

          this.templateService.templatePreviewWithTabs(
            productTemplate?.voucherTemplate?.defaultTemplateVersion,
            productTemplate?.smsTemplate?.defaultTemplateVersion,
            type
          );
        },
      });
  }

  applyVoucherPageDefaultValues(template: TemplateVersion) {
    if (!this.deliveryDetailsFormGroup) return;

    const emailSubjectTag = template.templateTags?.find(
      (tag) => tag.displayName.toLowerCase() === 'emailsubject'
    );
    const emailSubjectTagValue = template.templateTagValue.find(
      (tag) => tag.tagId === emailSubjectTag?.tagId
    );

    const emailGreetingTag = template.templateTags?.find(
      (tag) => tag.displayName.toLowerCase() === 'greetings'
    );
    const emailGreetingTagValue = template.templateTagValue.find(
      (tag) => tag.tagId === emailGreetingTag?.tagId
    );

    const defaultEmailSubjectValue =
      this.deliveryDetailsFormGroup.get('emailSubject')?.value;
    const defaultEmailGreetingValue =
      this.deliveryDetailsFormGroup.get('emailGreeting')?.value;

    if (
      emailSubjectTag &&
      emailSubjectTagValue &&
      defaultEmailSubjectValue &&
      !emailSubjectTagValue.value
    ) {
      emailSubjectTagValue.value = defaultEmailSubjectValue;
    }

    if (
      emailGreetingTag &&
      emailGreetingTagValue &&
      defaultEmailGreetingValue &&
      !emailGreetingTagValue.value
    ) {
      emailGreetingTagValue.value = defaultEmailGreetingValue;
    }
  }

  applySMSDefaultValues(template: TemplateVersion) {
    if (!this.deliveryDetailsFormGroup) return;

    const smsGreetingTag = template.templateTags?.find(
      (tag) => tag.displayName.toLowerCase() === 'smsgreetings'
    );
    const smsGreetingTagValue = template.templateTagValue.find(
      (tag) => tag.tagId === smsGreetingTag?.tagId
    );

    const defaultSMSGreetingValue =
      this.deliveryDetailsFormGroup.get('smsGreeting')?.value;

    if (
      smsGreetingTag &&
      smsGreetingTagValue &&
      defaultSMSGreetingValue &&
      !smsGreetingTagValue.value
    ) {
      smsGreetingTagValue.value = defaultSMSGreetingValue;
    }
  }

  onStatusChanged(orderLineId: number = 0, isActive: boolean = false) {
    this.statusChanged.emit({ orderLineId, status: isActive ? 1 : 0 });
  }
}
