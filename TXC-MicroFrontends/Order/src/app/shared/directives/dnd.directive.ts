import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appDnd]',
})
export class DndDirective {
  @Output() fileDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
  @HostBinding('class.fileover') fileOver!: boolean;

  @HostListener('dragover', ['$event']) OnDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;

    if (files.length > 0) {
      const emitFiles = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        if (
          [
            'pdf',
            'xls',
            'xlsx',
            'doc',
            'docx',
            'png',
            'tif',
            'html',
            'msg',
          ].includes(ext.toLowerCase())
        ) {
          emitFiles.push(file);
        }
      }
      this.fileDropped.emit(emitFiles);
    }
  }

  constructor() {}
}
