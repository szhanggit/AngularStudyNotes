import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { interval, fromEvent, Subscription } from 'rxjs';
import { AuthorizationService } from '../../services/authorization.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-token-refresher',
  templateUrl: './token-refresher.component.html',
  styleUrls: ['./token-refresher.component.scss']
})
export class TokenRefresherComponent implements OnInit, OnDestroy {
  @ViewChild('iframeContainer', { static: true }) iframeContainer!: ElementRef;

  public isTokenExpried?: boolean = false;

  readonly TITLE = 'Session timed out';
  readonly DESCRIPTION = 'Your token has expired. Please log in again to continue.';
  readonly BUTTON_TEXT = 'Log in';

  private readonly CHECK_FREQUENCY = 1 * 1000;
  private readonly REFRESH_FREQUENCY = 10 * 60 * 1000;
  private readonly IFRAME_TIMEOUT = 20 * 1000;

  private checkIntervalSubscription?: Subscription;
  private refreshIntervalSubscription?: Subscription;

  constructor(
    private readonly authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.checkTokenExpried();
    this.refreshToken();
  }

  private checkTokenExpried() {
    if (!environment.isLocal) {
      this.checkIntervalSubscription = interval(this.CHECK_FREQUENCY).subscribe(() => {
        this.isTokenExpried = this.authorizationService.isTokenExpired();
      });
    }
  }

  private refreshToken() {
    this.refreshIntervalSubscription = interval(this.REFRESH_FREQUENCY).subscribe(() => {
      if (this.authorizationService.canRefreshToken() || true) {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.style.display = 'none';
        iframe.src = this.authorizationService.getRefreshTokenUrl();
        iframe.onload = () => {
          if (iframe.contentWindow?.location.href.includes('done')) {
            this.authorizationService.updateToken();
            if (iframe) iframe.remove();
          }
        };
        iframe.onerror = () => {
          this.authorizationService.updateToken();
          if (iframe) iframe.remove();
        };
        this.iframeContainer.nativeElement.appendChild(iframe);
        setTimeout(() => {
          if (iframe) iframe.remove();
        }, this.IFRAME_TIMEOUT);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.checkIntervalSubscription) this.checkIntervalSubscription.unsubscribe();
    if (this.refreshIntervalSubscription) this.refreshIntervalSubscription.unsubscribe();
  }

  login() {
    this.authorizationService.login();
  }
}
