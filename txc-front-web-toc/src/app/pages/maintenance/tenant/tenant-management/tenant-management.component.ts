import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgProgressComponent } from 'ngx-progressbar';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { TenantState } from 'src/app/layouts/shared/models/tenant-state.model';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { environment } from 'src/environments/environment';

import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';
import { TenantListComponent } from '../tenant-list/tenant-list.component';

@Component({
  selector: 'app-tenant-management',
  templateUrl: './tenant-management.component.html',
  styleUrls: ['./tenant-management.component.scss']
})
export class TenantManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(TenantListComponent) tenantListComponent: TenantListComponent;
  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;


  searchKeyword: string;

  pageTitle: BreadcrumbItem[] = [];

  tenantState: TenantState;

  userClaim = new UserAuthClaim();

  enabledCreate : boolean = false;

  constructor(private router: Router,
    private readonly authSvc: AuthService) {
    this.tenantState = this.router.getCurrentNavigation()?.extras?.state;
  }
  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let viewTenantOpdId = parseInt(environment.view_tenant_op_id);
        if(! this.userClaim.operations.some(e => e === viewTenantOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.checkAllowedOperation();
      });
  }

  ngAfterViewInit(): void {
    if (this.tenantState?.showTenantAdded) {
      this.toast?.showSuccess(`${this.tenantState.tenantName} successfully added.`);
    }
  }
  checkAllowedOperation()
  {
    let createTenantOpsId = parseInt(environment.add_tenant_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledCreate = this.userClaim.operations.some(e => e === createTenantOpsId);
    }
  }
}
