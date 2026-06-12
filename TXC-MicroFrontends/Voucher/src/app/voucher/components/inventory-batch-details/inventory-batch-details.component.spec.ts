import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchDetailsComponent, InventoryBatchInterface } from './inventory-batch-details.component';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Tenant, TenantConfigService } from '../../service/tenant-config.service';
import { Pipe, PipeTransform } from '@angular/core';
import { InventoryBatchDetailsActionEnum } from '../../enum/inventory-sku-details-action-enum';
import { InventoryApiService } from '../../service/inventory-api.service';
import { of } from 'rxjs';
import { VoucherGeneralService } from '../../service/voucher-general.service';
class MockTenantConfigService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}

class MockToastComponent {
  showSuccess() {}
  showWarning() {}
  showDanger() {}
}

class MockVoucherGeneralService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}

class MockInventoryApiService {
  exportSkuInventoy() {
    return  of({
      data: {
        totalCount: 1,
        itemPerPage: 20,
        currentPage: 1,
        quotationItemList: [],
      },
    });
  }
  getInventoryListBySearchConditions() {
    return of({
      data: {
        totalCount: 1,
        itemPerPage: 20,
        currentPage: 1,
        quotationItemList: [],
      },
    });
  }
  getSkuIdsBySourceOrSkuCodeOrName() {
    return of({
      data: {
        totalCount: 1,
        itemPerPage: 20,
        currentPage: 1,
        quotationItemList: [],
      },
    });
  }
  getSkuIdByMercahntName() {
    return of({
      data: {
        totalCount: 1,
        itemPerPage: 20,
        currentPage: 1,
        quotationItemList: [],
      },
    });
  }
  getSkuIdsByProductCode() {
    return of({
      data: {
        totalCount: 1,
        itemPerPage: 20,
        currentPage: 1,
        quotationItemList: [],
      },
    });
  }
  getSkuDetailsBySkuId() {
    return of({
      data: {
        totalCount: 1,
        itemPerPage: 20,
        currentPage: 1,
        quotationItemList: [],
      },
    });
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

describe('InventoryBatchDetailsComponent', () => {
  let component: InventoryBatchDetailsComponent;
  let fixture: ComponentFixture<InventoryBatchDetailsComponent>;
  let mockRouter: Router;
  let activatedRoute: ActivatedRoute;
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  const mockFormBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventoryBatchDetailsComponent,
        MockToastComponent,
        mockPipe('txcLocalDateTime'),],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        NgbActiveModal,
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        FormBuilder,
        { provide: TenantConfigService, useClass: MockTenantConfigService },
        { provide: InventoryApiService, useClass: MockInventoryApiService },
        { provide: VoucherGeneralService, useClass: MockVoucherGeneralService },
        { provide: FormBuilder, useValue: mockFormBuilder},
      ],
    }).compileComponents();

    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    activatedRoute = TestBed.inject(ActivatedRoute);
    // const queryData = '123'
    // const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get');
    // spyRoute.and.returnValue(queryData);
    fixture = TestBed.createComponent(InventoryBatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openModal with trashBatchTemplate when type is InventoryBatchDetailsActionEnum.TRASH_BATCH', () => {
    const row: InventoryBatchInterface = {
      id: '1',
      skuId: '1',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
      trustAccountEndDate: '',
    }
    component.onAction(InventoryBatchDetailsActionEnum.TRASH_BATCH, row);
    expect(component.openModal).toHaveBeenCalledWith(component.trashBatchTemplate, 'md', row);
  });

  it('should call openModal with deleteBatchTemplate when type is InventoryBatchDetailsActionEnum.DELETE_BATCH', () => {
    const row: InventoryBatchInterface = {
      id: '1',
      skuId: '1',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
      trustAccountEndDate: '',
    }
    component.onAction(InventoryBatchDetailsActionEnum.DELETE_BATCH, row);
    expect(component.openModal).toHaveBeenCalledWith(component.deleteBatchTemplate, 'md', row);
  });

  it('should call openModal with downloadBatchTemplate when type is InventoryBatchDetailsActionEnum.DOWNLOAD_BATCH', () => {
    const row: InventoryBatchInterface = {
      id: '1',
      skuId: '1',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
      trustAccountEndDate: '',
    }
    component.onAction(InventoryBatchDetailsActionEnum.DOWNLOAD_BATCH, row);
    expect(component.openModal).toHaveBeenCalledWith(component.downloadBatchTemplate, 'md', row);
  });

  it('should call openModal with editDateInformationTemplate when type is InventoryBatchDetailsActionEnum.EDIT_DATE_INFO', () => {
    const row: InventoryBatchInterface = {
      id: '1',
      skuId: '1',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
      trustAccountEndDate: '',
    }
    component.onAction(InventoryBatchDetailsActionEnum.EDIT_DATE_INFO, row);
    expect(component.openModal).toHaveBeenCalledWith(component.editDateInformationTemplate, 'md', row);
  });

  
  it('should set 2999/12/31 ngbDate when setNoExpiry has been called', () => {
    component.setNoExpiry();
    const expectValue = component.editDateInformationForm.get('expiryDate')?.value;
    expect(expectValue).toEqual({
      year: 2999,
      month: 12,
      day: 31,
    });
  });

});
