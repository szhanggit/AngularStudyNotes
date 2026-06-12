import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthorizationService } from './security/services/authorization.service';
import { ActivatedRoute } from '@angular/router';
import { ToastStateService } from './shared/services/toast-state.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  title = 'Ticket Operation Center';

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly route: ActivatedRoute,
    private toastStateService: ToastStateService
  ) {}

  ngOnInit(): void {
    this.authorizationService.updateToken();
    this.toastStateService.toast$.subscribe((message) => {
      this.toast.showDanger(message);
    });
  }

  isAuthorized(): boolean {
    return this.authorizationService.isAuthorized() && !this.isError();
  }

  isError(): boolean {
    const path = this.route.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    return path.startsWith('error/');
  }
}
