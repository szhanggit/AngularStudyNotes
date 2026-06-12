import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaService } from 'src/app/system/services/media.service';
import { MediaCategoryEnum } from 'src/app/system/enum/mediaCategory.enum';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { MediaLibraryList } from 'src/app/system/models/media-library-list.model';

@Component({
  selector: 'app-media-library-list',
  templateUrl: './media-library-list.component.html',
  styleUrls: ['./media-library-list.component.scss']
})
export class MediaLibraryListComponent implements OnInit {
  
  @ViewChild(NgbNav) nav!: NgbNav;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  activeMediaTab: number = MediaCategoryEnum.Edenred;
  isLoading$ = new BehaviorSubject<boolean>(false);
  mediaLibData$: Observable<MediaLibraryList[]>;
  tabIndexCategory = MediaCategoryEnum;

  constructor(public _mediaService: MediaService) { 
    this._mediaService.category = this.activeMediaTab;
    this.mediaLibData$ = _mediaService.mediaLibrary$;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.nav.navChange.subscribe(e => {
      this.activeMediaTab = e.nextId;
      this._mediaService.searchTerm = '';
      this._mediaService.category = this.activeMediaTab;
    })
  }

  OnReplaceMediaImage(imageData : any) {
    // replace image data api integration
  }

  OnEditMediaImage(imageData : any) {
    // edit image data api integration
  }
}
