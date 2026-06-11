import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BatchUpdateProductCombo, BatchUpdateProductComboRequest, UpdateProductComboListItem } from 'src/app/products/models/master-product/batch-update-product-combo.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-combo-batch-update',
  templateUrl: './product-combo-batch-update.component.html',
  styleUrls: ['./product-combo-batch-update.component.scss']
})
export class ProductComboBatchUpdateComponent implements OnInit {

  readonly ALLOWED_FILE_TYPES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  readonly ERROR_MSG_INVALID_FILE_TYPE = 'Invalid file type. Please choose one .xlsx file or download template.';
  readonly ERROR_MSG_INVALID_FILE_CONTENT = 'Invalid file content.';
  readonly URL_PATH_PRODUCT_LIST = '/products';

  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  batchUpdateComboList: Array<BatchUpdateProductCombo> = [];

  dragOver = false;

  get allowedFileTypes(): string {
    let result = '';
    this.ALLOWED_FILE_TYPES.forEach(item => {
      result += item + ',';
    });
    return result.slice(0, -1);
  }

  get isValidToSave(): boolean {
    if (this.batchUpdateComboList.length === 0) return false;
    for (var item of this.batchUpdateComboList) {
      if (item.error != null) {
        return false;
      }
    }
    return true;
  }

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly router: Router,
  ) {

  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    if (event.target.files.length === 0) return;

    const file: File = event.target.files[0];
    if (file && this.ALLOWED_FILE_TYPES.includes(file.type)) {
      this.uploadFile(file);
    } else {
      this.toast.showDanger(this.ERROR_MSG_INVALID_FILE_TYPE);
    }
    event.target.value = null;
  }

  // element events

  onDrop(event: any) {
    this.dragOver = false;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.length === 0) return;
    if (this.batchUpdateComboList.length != 0) return;

    const file: File = event.dataTransfer.files[0];
    if (file && this.ALLOWED_FILE_TYPES.includes(file.type)) {
      this.uploadFile(file);
    } else {
      this.toast.showDanger(this.ERROR_MSG_INVALID_FILE_TYPE);
    }
  }

  onFileDropZoneClick(event: any) {
    document.getElementById('file-input')!.click();
  }

  onReuploadClick() {
    document.getElementById('file-input')!.click();
  }

  private uploadFile(file: File) {
    this.masterProductApiService.uploadBatchUpdateProductCombo(file).subscribe({
      next: (res) => {
        if (res.success) {
          this.batchUpdateComboList = res.data.items;
        }
      },
      error: (err) => {
        this.toast.showDanger(this.ERROR_MSG_INVALID_FILE_CONTENT);
      },
      complete: () => { }
    });
  }

  onClickDownloadTemplate() {
    this.masterProductApiService.downloadBatchUpdateProductComboTemplate().subscribe({
      next: (res) => {
        const filename = res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        const blob: Blob = res.body as Blob;
        let a = document.createElement('a');
        a.download = filename ?? `AddChildProductsToSCVAndSPV.xlsx`;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
      },
      error: (err) => {
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => { }
    });
  }

  onSaveClick() {
    const batchUpdateComboListItems = this.batchUpdateComboList.map(item => ({
      masterProductId: item.masterProductId,
      childProductId: item.childProductId
    }));
    const list: Array<UpdateProductComboListItem> = [];
    list.push(...batchUpdateComboListItems);
    const body: BatchUpdateProductComboRequest = { updateProductComboList: list };
    this.masterProductApiService.batchUpdateProductCombo(body).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate([this.URL_PATH_PRODUCT_LIST], { state: { isBatchUpdatedCombo: true } });
        }
      },
      error: (err) => {
        this.toast.showDanger(this.ERROR_MSG_INVALID_FILE_CONTENT);
      },
      complete: () => { }
    });
  }

  onCancelClick() {
    this.router.navigateByUrl(this.URL_PATH_PRODUCT_LIST);
  }

  // element present events

  @HostListener('dragover', ['$event'])
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
    this.changeDetector.detectChanges();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    this.changeDetector.detectChanges();
  }

}
