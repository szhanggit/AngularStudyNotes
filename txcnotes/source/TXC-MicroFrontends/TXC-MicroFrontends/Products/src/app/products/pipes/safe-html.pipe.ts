import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})

export class SafeHtmlPipe implements PipeTransform {
  constructor( private domSanitizer: DomSanitizer) {}

  transform(
    value: any,
    context: SecurityContext = SecurityContext.HTML,
  ): SafeValue | null {
    return this.bypassSecurityTrust(context, this.domSanitizer.sanitize(context, value) );
  }

  private bypassSecurityTrust(
    context: SecurityContext,
    purifiedValue: any,
  ): SafeValue | null {
    switch (context) {
      case SecurityContext.HTML:
        return this.domSanitizer.bypassSecurityTrustHtml(purifiedValue);
      case SecurityContext.STYLE:
        return this.domSanitizer.bypassSecurityTrustStyle(purifiedValue);
      case SecurityContext.SCRIPT:
        return this.domSanitizer.bypassSecurityTrustScript(purifiedValue);
      case SecurityContext.URL:
        return this.domSanitizer.bypassSecurityTrustUrl(purifiedValue);
      case SecurityContext.RESOURCE_URL:
        return this.domSanitizer.bypassSecurityTrustResourceUrl(purifiedValue);
      default:
        return null;
    }
  }
}