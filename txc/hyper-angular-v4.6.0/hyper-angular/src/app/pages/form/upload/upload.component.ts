import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-forms-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  files: File[] = [];

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Forms', path: '/' }, { label: 'Upload', path: '/', active: true }];
  }

  /**
   * adds new file in uploaded files
   * @param event event
   */
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  /**
   * removes file from uploaded files
   * @param event event
   */
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  /**
  * Formats the size
  */
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

  }


  /**
   * returns preview url of uploaded file
   */
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

}
