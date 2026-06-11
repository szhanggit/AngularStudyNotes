import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent, NgbdToastGlobal } from '@txc-angular/component-library';
import { Product } from '../../models/product.model';
import { TextEditorService } from '../../services/text-editor.service';
import { decode } from 'html-entities';
import { MasterProductApiService } from '../../services/master-product-api.service';
import { MasterProductComboService } from '../../services/master-product-combo.service';
import { MasterProductService } from '../../services/master-product.service';
import { UpdateBatchFootnoteRequest } from '../../models/put-batchfootnote-request';
import { SortingStatusEnum } from '../../enums/sorting-status.enum';
import { Subject, takeUntil, filter, startWith } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProductTypeEnum } from '../../enums/product-type.enum';

@Component({
  selector: 'app-batch-update-product',
  templateUrl: './batch-update-product.component.html',
  styleUrls: ['./batch-update-product.component.scss']
})
export class BatchUpdateProductComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  readonly CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_NAME = 'Product Name';
  readonly ERROR_MESSAGE_NO_PRODUCT = 'Product code doesn\'t exist: ';
  readonly ERROR_MESSAGE_ERROR = 'Error: ';
  readonly RESET_MODAL_TITLE = 'Reset product list';
  readonly RESET_MODAL_DESCRIPTION = 'Are you sure you want to reset? All product list will be cleared.';
  readonly RESET_MODAL_FIRST_BUTTON = 'Continue editing';
  readonly RESET_MODAL_SECOND_BUTTON = 'Reset';
  readonly ERROR_MESSAGE_CANNOT_ADD_MASTER_PRODUCT = 'Master product can\'t be added: ';

  readonly CONTAINER_NAME_UPDATE_ITEM = 'updateItem';
  readonly CONTAINER_NAME_SEARCH = 'search';
  readonly CONTAINER_NAME_COMFIRM = 'confirm';
  readonly URL_PATH_PRODUCT_LIST = '/products';
  readonly HTML_EDITOR_CONFIG: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    toolbarHiddenButtons: [
      [
        'customClasses',
        'insertImage',
        'insertVideo',
        'fontName',
        'insertHorizontalRule',
        'backgroundColor',
      ]
    ],
  };
  updateItemList = ['footnote'];
  currentStep: Number = 1;
  updateItemCollapsed = false;
  searchCollapsed = true;
  confirmCollapsed = true;
  showNoResult = false;

  errorMessageList: string[] = [];

  searchProductList: Array<Product> = [];
  selectProductList: Array<Product> = [];
  confirmProductList: Array<Product> = [];
  htmlContentText: string = '';
  confirmSortingMap = new Map<string, SortingStatusEnum>();
  sortingStatusEnum = SortingStatusEnum;

  updateProductFormGroup = this.formBuilder.group({
    updateItem: [this.updateItemList[0], [Validators.required]],
    htmlContent: [''],
    searchKeyword: [''],
    productCodeList: [''],
  });

  destroy$ = new Subject();

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly textEditorService: TextEditorService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly masterProductService: MasterProductService,
  ) {
    this.confirmSortingMap.set(this.CONFIRM_PRODUCT_TABLE_HEADER_PRODUCT_NAME, SortingStatusEnum.None);
  }


  ngOnInit(): void {
  }

  onRichTextChange() {
    let richText = this.updateProductFormGroup.get('htmlContent')?.value;
    richText = richText.trim().replaceAll('</li>', '</li>\r\n');
    this.htmlContentText = this.textEditorService.convertHtmlToPlainText(decode(richText));
  }

  autoGrowTextAreaZone(isClearing?: boolean) {
    const textarea = this.elementRef.nativeElement.querySelector('#product-code-list');
    const maxHeight = 100;

    if (isClearing) {
      this.updateProductFormGroup.get('productCodeList')?.reset();
    }

    textarea.style.height = '0px';
    textarea.style.height = textarea.scrollHeight + 5 < maxHeight ? textarea.scrollHeight + 5 + 'px' : maxHeight + 'px';
  }

  onEnterClick(): void {
    this.errorMessageList = [];
    const codes = this.updateProductFormGroup.get('productCodeList')?.value.split(/\r?\n/);
    const uniCodes = codes.filter((value: any, index: number, self: any) =>
      index === self.findIndex((e: any) => e === value)
    );
    this.masterProductApiService
      .getProductInfoByProductCodeList(uniCodes)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            this.onAddToConfirm(data.productInfoMassive.items);
            const errCodes = uniCodes;
            data.productInfoMassive.items.forEach((product: any) => {
              const index = errCodes.findIndex((code: string) => {
                return code === product.productCode
              });
              if (index >= 0) {
                errCodes.splice(index, 1);
              }
            });
            if (errCodes.length > 0) {
              this.errorMessageList.push(`${this.ERROR_MESSAGE_NO_PRODUCT} ${errCodes.toString()}`);
            }
          }
        },
        error: (msg) => {
        },
        complete: () => {
          this.autoGrowTextAreaZone(true);
        },
      });
  }

  onSearchClick(): void {
    this.searchProductList = [];
    this.selectProductList = [];
    const searchKeyword = this.updateProductFormGroup.get('searchKeyword')?.value;
    if (!searchKeyword) return;
    this.masterProductApiService.productInfoByKeyword(searchKeyword).subscribe({
      next: (res) => {
        if (res.success) {
          this.showNoResult = true;
          const data = (JSON.parse(res.data));
          const productInfoList: Product[] = this.masterProductService.convertProductInfoDataToProductList(data);
          productInfoList.forEach(product => {
            if (!(product.productType === ProductTypeEnum.SuperVoucher || product.productType === ProductTypeEnum.SmartChoiceVoucher)) {
              product.checked = false;
              this.searchProductList.push(product);
            } else {
              return;
            }
          });
        }
      },
      error: (err) => {
        this.toast.showDanger(err.error?.message);
      },
      complete: () => {
      },
    });
  }

  onSearchResetClick() {
    this.updateProductFormGroup.get('searchKeyword')?.reset();
  }

  onAddToConfirm(product: Product[]): void {
    this.errorMessageList = [];
    if (product.length === 0) {
      this.errorMessageList = [];
    }
    product.forEach((item) => {
      if (this.confirmProductList.find(p => p.productCode === item.productCode) === undefined) {
        this.confirmProductList.push(item);
        this.toggleConstainerGroup(this.CONTAINER_NAME_COMFIRM);
      }
    });
    this.toggleConstainerGroup(this.CONTAINER_NAME_COMFIRM);
  }

  onConfirmResetClick() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.title = this.RESET_MODAL_TITLE;
    modalRef.componentInstance.description = this.RESET_MODAL_DESCRIPTION;
    modalRef.componentInstance.firstButton = {
      buttonText: this.RESET_MODAL_FIRST_BUTTON,
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: this.RESET_MODAL_SECOND_BUTTON,
      buttonClass: 'btn-primary',
    };

    modalRef.result.then((res) => {
      if (res === 'confirm') {
        this.confirmProductList = [];
        this.selectProductList = [];
        this.searchProductList = [];
        this.updateProductFormGroup.get('searchKeyword')?.reset;
        this.toggleConstainerGroup(this.CONTAINER_NAME_SEARCH);
      }
    });
  }

  onSelectionCheckClick(checked: boolean, productCode: string): void {
    const selectProductListIndex = this.selectProductList.findIndex((p) => p.productCode === productCode);
    if (checked) {
      if (selectProductListIndex < 0 && this.searchProductList.find((p) => p.productCode === productCode)) {
        this.selectProductList.push(this.searchProductList.find((p) => p.productCode === productCode)!);
      }
    } else {
      if (selectProductListIndex >= 0)
        this.selectProductList.splice(selectProductListIndex, 1);
    }
  }

  toggleCheckboxes(checked: boolean): void {
    if (checked) {
      this.searchProductList.forEach((product) => {
        product.checked = true;
        if (
          this.selectProductList.find(
            (p) => p.productCode === product.productCode
          ) === undefined
        )
          this.selectProductList.push(product);
      });
    } else {
      this.searchProductList.forEach((product) => {
        product.checked = false;
        if (
          this.selectProductList.find(
            (p) => p.productCode === product.productCode
          )
        )
          this.selectProductList.splice(
            this.selectProductList.findIndex(
              (p) => p.productCode === product.productCode
            ),
            1
          );
      });
    }
  }

  getConfirmProductTableSortingStatus(tableName: string): SortingStatusEnum {
    let status = SortingStatusEnum.None;
    this.confirmSortingMap.forEach((item, key) => {
      if (key === tableName)
        status = item;
    });
    return status;
  }

  resetHtmlContent() {
    this.updateProductFormGroup.get('htmlContent')?.reset();
  }

  toggleContainer(container: string, collapsed?: boolean) {
    this.showNoResult = false;
    switch (container) {
      case this.CONTAINER_NAME_UPDATE_ITEM: {
        this.updateItemCollapsed = collapsed === undefined ? !this.updateItemCollapsed : collapsed;
        if (!this.updateItemCollapsed) {
          this.currentStep = 1;
        }
        break;
      }
      case this.CONTAINER_NAME_SEARCH: {
        this.searchCollapsed = collapsed === undefined ? !this.searchCollapsed : collapsed;
        if (!this.searchCollapsed) {
          this.currentStep = 2;
        }
        break;
      }
      case this.CONTAINER_NAME_COMFIRM: {
        this.confirmCollapsed = collapsed === undefined ? !this.confirmCollapsed : collapsed;
        if (!this.confirmCollapsed) {
          this.currentStep = 3;
        }
        break;
      }
    }
  }

  // Expand the selected section and collapse the others
  toggleConstainerGroup(container: string) {
    if (this.updateItemCollapsed || this.searchCollapsed || this.confirmCollapsed) {
      const containerList: string[] = [this.CONTAINER_NAME_UPDATE_ITEM, this.CONTAINER_NAME_SEARCH, this.CONTAINER_NAME_COMFIRM];
      containerList.splice(containerList.findIndex(e => e === container), 1)
      this.toggleContainer(container, false);
      containerList.forEach((containerName: string) => {
        this.toggleContainer(containerName, true);
      });
    }
  }

  listSortingConfirmProductTable(tableName: string) {
    this.confirmProductList.sort((a, b) => {
      const itemA = a.productName.toUpperCase();
      const itemB = b.productName.toUpperCase();
      if (itemA < itemB) {
        return -1;
      }
      if (itemA > itemB) {
        return 1;
      }
      return 0;
    });

    // change sorting status
    if (this.confirmSortingMap.get(tableName) === SortingStatusEnum.None ||
      this.confirmSortingMap.get(tableName) === SortingStatusEnum.Descending) {
      this.confirmSortingMap.set(tableName, SortingStatusEnum.Ascending);
    }
    else if (this.confirmSortingMap.get(tableName) === SortingStatusEnum.Ascending) {
      this.confirmProductList.reverse();
      this.confirmSortingMap.set(tableName, SortingStatusEnum.Descending);
    }
    // initialize other sorting status
    this.confirmSortingMap.forEach((item, key) => {
      if (key != tableName)
        this.confirmSortingMap.set(key, SortingStatusEnum.None);
    });
  }


  cancel() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.title = 'Cancel editing';
    modalRef.componentInstance.description = 'Are you sure you want to leave this page without saving?';
    modalRef.componentInstance.firstButton = {
      buttonText: 'Discard',
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: 'Keep editing',
      buttonClass: 'btn-primary',
    };
    modalRef.result.then((res: string) => {
      if (res === 'cancel') {
        this.router.navigateByUrl(this.URL_PATH_PRODUCT_LIST);
      }
    });
  }

  save() {
    this.errorMessageList = [];
    const footnote = this.updateProductFormGroup.get('htmlContent')?.value;
    const footnoteContent = footnote.trim().replace(/&#10;/g, '').replaceAll('</li>', '</li>\r\n');;
    const body: UpdateBatchFootnoteRequest = {
      productIdList: this.confirmProductList.map(e => e.productId),
      footnote: footnoteContent,
      textValue: this.htmlContentText,
      applyToOrder: false
    };
    this.toggleConstainerGroup(this.CONTAINER_NAME_COMFIRM);
    this.masterProductApiService.updateBatchFootnote(body).subscribe({
      next: res => {
        setTimeout(() => {
          const message = `Batch update product successful!`;
          this.toast.showSuccess(message);
        }, 2000);
        this.router.navigateByUrl(this.URL_PATH_PRODUCT_LIST);
      },
      error: err => {
        if (err.error?.data === '00000000-0000-0000-0000-000000000000') {
          if (err.error?.message) {
            let message = err.error?.message;
            const productIds = message.slice(message.indexOf(":") + 1, err.error?.message.length).split(',');
            productIds.forEach((productId: any) => {
              const productCode = this.confirmProductList.find(e => e.productId == productId)?.productCode;
              message = message.replace(productId.toString(), ` ${productCode}`)
            });
            this.errorMessageList.push(message);
          }
        } else {
          this.toast.showDanger(err.error?.message);
        }
        if (err.error?.message === 'Invalid model') {
          err.error?.data.forEach((errMessage: string) => {
            this.toast.showDanger(errMessage);
          });
        }

      },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
