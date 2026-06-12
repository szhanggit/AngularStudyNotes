import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.scss']
})
export class ViewMediaComponent implements OnInit {

  @Input() mediaList!: any;
  @Output() replaceImage = new EventEmitter<any>();
  @Output() editImage = new EventEmitter<any>();
  mediaURL = environment.mediaLibraryUrl;
  errorMessage = 'No matches result. Please try different keywords.';

  constructor() { }

  ngOnInit(): void {
  }

  handleReplace(mediaId: number, event: any) {
    event.stopPropagation();
    this.replaceImage.emit(mediaId);
  }

  handleEdit(mediaId: number, event: any) {
    event.stopPropagation();
    this.editImage.emit(mediaId);
  }

  openImage(imageURL: string) {
    window.open(environment.mediaLibraryUrl + imageURL, '_blank');
  }
}
