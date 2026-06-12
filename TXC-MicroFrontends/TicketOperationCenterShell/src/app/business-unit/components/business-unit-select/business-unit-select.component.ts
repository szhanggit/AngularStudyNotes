import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Tenant } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { AuthorizationService } from 'src/app/security/services/authorization.service';

@Component({
  selector: 'app-select',
  templateUrl: './business-unit-select.component.html',
  styleUrls: ['./business-unit-select.component.scss'],
})

export class BusinessUnitSelectComponent implements OnInit {
  @Input() tenants: Tenant[] = [];
  @Input() public returnUrl: any;

  currentBaseUrl: string;

  constructor(public tenantService: TenantService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private readonly authorizationService: AuthorizationService) {
    let splited = window.location.toString().split('\/');
    this.currentBaseUrl = splited[0] + "//" + environment.apiUrl + "api/";
  }

  ngOnInit() {
    this.tenantService.GetTenants().subscribe(
      (response) => {
        this.tenants = response;
      });
  }

  selectBu(tenant: Tenant) {
    if (tenant.id) {
      localStorage.setItem('tenant', JSON.stringify(tenant));
      if (tenant.name) {
        this.tenantService.currentTenant$.next(tenant.name);
      }
      this.authorizationService.updateToken();
      this.activeModal.close();
      this.router.navigate([this.returnUrl ? this.returnUrl : '']);
    }
  }
}
