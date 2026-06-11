import { Component, Input, OnInit } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.scss']
})
export class SpinnerOverlayComponent implements OnInit {

  constructor(public loaderService: LoaderService,
    public authLibraryService: AuthorizationLibraryService) {}

  public ngOnInit() {}
}
