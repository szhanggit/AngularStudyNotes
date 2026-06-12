import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessUnitSelectComponent } from '../../business-unit/components/business-unit-select/business-unit-select.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitGuard implements CanActivate {
  constructor(private router: Router,
    private modalService: NgbModal) { };

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('tenant')) {
      return true
    } else {
      const modalRef = this.modalService.open(BusinessUnitSelectComponent, {
        centered: true,
        size: 'md',
        backdrop: 'static',
      });
      modalRef.componentInstance.returnUrl = state.url;
      return false;
    }
  }

}
