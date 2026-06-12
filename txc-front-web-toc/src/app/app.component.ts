import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { LoadingService } from './core/service/loading/loading.service';
import { AuthService } from './core/service/security/auth.service';
import { AgGridColFitToSizeService } from './core/service/tools/ag-grid-col-fit-to-size.service';
import { ToasterService } from './core/service/tools/toaster.service';
import { NgbdToastGlobal } from './shared/toast/toast-global.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  title = 'web-toc';
  loading: boolean = false;

  @HostListener('window:resize',['$event'])
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  onResize(event:any)
  {
    this.agGridColFitToSizeSvc.broadcast();
  }

  constructor(private _loading: LoadingService
    , private readonly agGridColFitToSizeSvc: AgGridColFitToSizeService
    , private readonly authSvc: AuthService
    , private readonly toasterSrv : ToasterService
  ){
  }
  ngAfterViewInit(): void {
    this.toasterSrv.toaster.next(this.toast);
  }
  ngOnDestroy(): void {
    this.authSvc.authentication.unsubscribe();
  }

  ngOnInit() {
    this.listenToLoading();
    this.authSvc.fnGetAuth();
  }

  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
