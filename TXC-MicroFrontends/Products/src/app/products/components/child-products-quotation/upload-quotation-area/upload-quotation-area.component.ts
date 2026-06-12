import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ErrorMessage } from 'src/app/products/models/error-message.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-quotation-area',
  templateUrl: './upload-quotation-area.component.html',
  styleUrls: ['./upload-quotation-area.component.scss']
})
export class UploadQuotationAreaComponent implements OnInit {
  @Input() quotationFile!: File | null;
  @Output() quotationFileChanged: EventEmitter<File | null> = new EventEmitter<File | null>()

  dragOver = false;
  allowedFileTypes = '.xls, .xlsx';
  errorMessages: ErrorMessage[] = [];

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
  }
  // download file logic
  downloadTemplate(event: Event) {
    event.stopPropagation();
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = environment.local ? '/assets/templates/template.xls' : '/move/assets/templates/template.xls';
    link.download = 'Apply child products.xls';
    document.body.appendChild(link);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    link.remove();
  }

  // upload file logic
  onFileSelected(event: any) {
    this.errorMessages = [];
    if (event.target.files.length === 0) return;

    const files = this.checkExtension(event.target.files);
    if (files.length) {
      this.quotationFileChanged.emit(files[0]);
    }
    event.target.value = null;
  }

  private checkExtension(files: File[]): File[] {
    const result = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      if (ext && ['xls', 'xlsx'].includes(ext)) {
        result.push(file);
      } else {
        this.errorMessages.push({
          type: 'File',
          description: 'Invalid file type',
        });
        this.quotationFileChanged.emit(null);
      }
    }
    return result;
  }

  // element events

  onDrop(event: any) {
    this.errorMessages = [];
    this.dragOver = false;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.length === 0) return;

    const files = this.checkExtension(event.dataTransfer.files);
    if (files) {
      this.quotationFileChanged.emit(files[0]);
    }
  }

  onFileDropZoneClick(event: any) {
    document.getElementById('file-input')!.click();
  }

  removeFile(event: any) {
    event.stopPropagation();
    this.quotationFileChanged.emit(null);
  }

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
