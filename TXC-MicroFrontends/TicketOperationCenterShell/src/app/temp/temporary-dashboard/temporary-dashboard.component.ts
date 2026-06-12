import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessUnitSelectComponent } from 'src/app/business-unit/components/business-unit-select/business-unit-select.component';
import { TenantService } from 'src/app/business-unit/services/tenant.service';

@Component({
  selector: 'app-temporary-dashboard',
  templateUrl: './temporary-dashboard.component.html',
  styleUrls: ['./temporary-dashboard.component.scss']
})
export class TemporaryDashboardComponent implements OnInit {
  tenantName!: string;

  constructor(private readonly tenantService: TenantService,
    private readonly modalService: NgbModal) {
    this.tenantService.currentTenant$.subscribe(currentTenant => {
      this.tenantName = currentTenant;
    });

    const currentTenantFromLocalStorage = tenantService.GetTenantFromLocalStorage()?.name ?? '';
    if (currentTenantFromLocalStorage) {
      tenantService.currentTenant$.next(currentTenantFromLocalStorage);
    } else {
      this.modalService.open(BusinessUnitSelectComponent, {
        centered: true,
        size: 'md',
        backdrop: 'static'
      });
    }
  }

  ngOnInit(): void {
  }
}
