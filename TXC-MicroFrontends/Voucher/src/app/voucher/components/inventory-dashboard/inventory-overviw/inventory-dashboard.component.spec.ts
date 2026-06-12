import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { TenantConfigService } from 'src/app/voucher/service/tenant-config.service';
import { InventoryApiService } from 'src/app/voucher/service/inventory-api.service';
import { of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

class MockTenantConfigService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}
class MockInventoryApiService {
  exportSkuInventoy() {
    return ''
  }
}


export function mockPipe(name: string): Pipe {
  const metadata: Pipe = {
    name
  };
  return Pipe(metadata)(
    class MockPipe implements PipeTransform {
      transform() { }
    }
  );
}

class MockToastComponent {
  showSuccess() { }
  showWarning() { }
  showDanger() { }
}



fdescribe('InventoryDashboardComponent', () => {
  let component: InventoryDashboardComponent;
  let fixture: ComponentFixture<InventoryDashboardComponent>;
  let mockRouter: Router;
  const activatedRouteStub = {
    queryParams: of({ skuId: '2' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventoryDashboardComponent,
        // MockToastComponent,
        mockPipe('txcLocalDateTime'),
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TenantConfigService, useClass: MockTenantConfigService },
        { provide: InventoryApiService, useClass: MockInventoryApiService },
      ]
    })
      .compileComponents();


    const tenant = {
      tenantId: 7,
      name: 'TW',
    };
    localStorage.setItem('tenant', JSON.stringify(tenant));

    // mockRouter = TestBed.inject(Router);
    // spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    // spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    // activatedRoute = TestBed.inject(ActivatedRoute);
    // const queryData = '123'
    // const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get');
    // spyRoute.and.returnValue(queryData);
    fixture = TestBed.createComponent(InventoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const dummySkuList = [
      {
        skuCode: 'Dummy third party import',
        skuName: 'Dummy Name',
        skuId: 2,
        source: component.skuDetailSourceTypeEnum.IMPORT,
        tick: false,
        isCritical: false,
        expiryDate: '',
        trustAccountEndDate: '',
        totalRemainingQuantity: '50'
      },
      {
        skuCode: 'Dummy Edenred Code',
        skuName: 'Dummy Edenred Name',
        skuId: 3,
        source: component.skuDetailSourceTypeEnum.EDENRED,
        tick: false,
        isCritical: false,
        expiryDate: '',
        trustAccountEndDate: '',
      },
      {
        skuCode: 'Dummy TPC Code',
        skuName: 'Dummy TPC Name',
        skuId: 4,
        source: component.skuDetailSourceTypeEnum.TPC,
        tick: false,
        isCritical: true,
        expiryDate: '',
        trustAccountEndDate: '',
      },
    ];
  });


  it('should set selectAll as true and all "tick" in voucherList as true when onSelectAll is tick', () => {
    const dummySkuList: any[] = [
      {
        skuCode: 'Dummy third party import',
        skuName: 'Dummy Name',
        skuId: 2,
        source: component.skuDetailSourceTypeEnum.IMPORT,
        tick: false,
        isCritical: false,
        isNoExpiration: false,
      },
      {
        skuCode: 'Dummy Edenred Code',
        skuName: 'Dummy Edenred Name',
        skuId: 3,
        source: component.skuDetailSourceTypeEnum.EDENRED,
        tick: false,
        isCritical: false,
        isNoExpiration: false,
      },
      {
        skuCode: 'Dummy TPC Code',
        skuName: 'Dummy TPC Name',
        skuId: 4,
        source: component.skuDetailSourceTypeEnum.TPC,
        tick: false,
        isCritical: true,
        isNoExpiration: true,
      }];
    component.selectAll = false;
    component.skuList = dummySkuList;
    component.onSelectAll();
    fixture.detectChanges();
    expect(component.selectAll).toBeTrue();
    expect(component.skuList.filter(e => e.tick === true).length).toBe(3);
  });

  it('should set selectAll as false and all "tick" in voucherList as false when onSelectAll is not tick', () => {
    const dummySkuList: any[] = [
      {
        skuCode: 'Dummy third party import',
        skuName: 'Dummy Name',
        skuId: 2,
        source: component.skuDetailSourceTypeEnum.IMPORT,
        tick: false,
        isCritical: false,
        isNoExpiration: false,
      },
      {
        skuCode: 'Dummy Edenred Code',
        skuName: 'Dummy Edenred Name',
        skuId: 3,
        source: component.skuDetailSourceTypeEnum.EDENRED,
        tick: false,
        isCritical: false,
        isNoExpiration: false,
      },
      {
        skuCode: 'Dummy TPC Code',
        skuName: 'Dummy TPC Name',
        skuId: 4,
        source: component.skuDetailSourceTypeEnum.TPC,
        tick: false,
        isCritical: true,
        isNoExpiration: true,
      }
    ];
    component.selectAll = true;
    component.skuList = dummySkuList;
    component.onSelectAll();
    fixture.detectChanges();
    expect(component.selectAll).toBeFalse();
    expect(component.skuList.filter(e => e.tick === true).length).toBe(0);
  });

  it('should navigate to edit merchant page when navigateToUpdateMerchant is called', () => {
    const item = {
      skuId: 2,
      source: 3,
    };

    component.navigateTo('dummy/url/');
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['dummy/url/2']);
  });
});
