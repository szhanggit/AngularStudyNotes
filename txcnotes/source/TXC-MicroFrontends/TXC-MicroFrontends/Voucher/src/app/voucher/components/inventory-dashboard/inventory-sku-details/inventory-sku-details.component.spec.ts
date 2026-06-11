import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySkuDetailsComponent } from './inventory-sku-details.component';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder, NgModel, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule, NgbTooltipModule, NgbActiveModal, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Tenant, TenantConfigService } from 'src/app/voucher/service/tenant-config.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { InventorySkuDetailsActionEnum } from 'src/app/voucher/enum/inventory-sku-details-action-enum';
import { ProductTypeEnum } from 'src/app/voucher/enum/product-type.enum';
import { InventoryDashboardComponent } from '../inventory-overviw/inventory-dashboard.component';
import { InventoryBatchInterface } from '../../inventory-batch-details/inventory-batch-details.component';
import { Pipe, PipeTransform } from '@angular/core';

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

class MockInventoryDashboardComponent {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}

describe('InventorySkuDetailsComponent', () => {
  let component: InventorySkuDetailsComponent;
  let fixture: ComponentFixture<InventorySkuDetailsComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventorySkuDetailsComponent,
        MockToastComponent,
        mockPipe('txcLocalDateTime'),
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbCollapseModule,
        NgbTooltipModule,
      ],
      providers: [
        NgbModal,
        FormBuilder,
        { provide: TenantConfigService, useClass: MockTenantConfigService },
        { provide: InventoryDashboardComponent, useClass: MockInventoryDashboardComponent }
      ]
    })
      .compileComponents();
    let mockRouter: Router;
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    activatedRoute = TestBed.inject(ActivatedRoute);
    // const queryData = '123'
    // const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get');
    // spyRoute.and.returnValue(queryData);
    fixture = TestBed.createComponent(InventorySkuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set edenred action dropdown list when mode is edenred', () => {
    component.source = component.skuDetailSourceTypeEnum.EDENRED;
    component.setActionDropdown();
    expect(component.actionList).toBe(component.ACTIONLIST_EDENRED);
  });
  it('should set TPC action dropdown list when mode is TPC', () => {
    component.source = component.skuDetailSourceTypeEnum.TPC;
    component.setActionDropdown();
    expect(component.actionList).toBe(component.ACTIONLIST_TPC);
  });
  it('should set 3rd party import action dropdown list when mode is 3rd party import', () => {
    component.source = component.skuDetailSourceTypeEnum.IMPORT;
    component.setActionDropdown();
    expect(component.actionList).toBe(component.ACTIONLIST_THIRD_PARTY_IMPORT);
  });

  it('should reset addStockQtyForm when addStockQty is called with true', () => {
    component.addStockQtyForm.reset = jasmine.createSpy();
    component.toast = {
      showSuccess: jasmine.createSpy()
    } as unknown as any;
    component.addStockQty(true);
    expect(component.addStockQtyForm.reset).toHaveBeenCalled();
  });

  it('should reset addStockQtyForm when addStockQty is called with false', () => {
    component.addStockQtyForm.reset = jasmine.createSpy();
    component.toast = {
      showSuccess: jasmine.createSpy()
    } as unknown as any;
    component.addStockQty(false);
    expect(component.addStockQtyForm.reset).toHaveBeenCalled();
  });

  it('should call openModal with downloadReasonTemplate when type is InventorySkuDetailsActionEnum.DOWNLOAD_INVENTORY', () => {
    component.openModal = jasmine.createSpy();
    const row: InventoryBatchInterface = {
      id: '1',
      skuId: '1',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
      trustAccountEndDate: '',
    }
    component.onAction(InventorySkuDetailsActionEnum.DOWNLOAD_INVENTORY, row);
    expect(component.openModal).toHaveBeenCalledWith(component.downloadReasonTemplate, 'md', row);
  });

  it('should call openModal with trashInventoryTemplate when type is InventorySkuDetailsActionEnum.TRASH_INVENTORY', () => {
    component.openModal = jasmine.createSpy();
    const row: InventoryBatchInterface = {
      id: '1',
      skuId: '1',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
      trustAccountEndDate: '',
    }
    component.onAction(InventorySkuDetailsActionEnum.TRASH_INVENTORY, row);
    expect(component.openModal).toHaveBeenCalledWith(component.trashInventoryTemplate, 'md', row);
  });

  it('should call openModal with addStockQtyTemplate when type is InventorySkuDetailsActionEnum.ADD_STOCK_QTY', () => {
    component.openModalAddStockQty = jasmine.createSpy();
    component.onAction(InventorySkuDetailsActionEnum.ADD_STOCK_QTY);
    expect(component.openModalAddStockQty).toHaveBeenCalled();
  });

  it('should navigate tothe page when navigateTo is called', () => {
    const item = {
      source: 1
    }
    // mock router to control routing
    let mockRouter: Router;
    mockRouter = TestBed.inject(Router);
    component.navigateTo('dummy/url', item);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['dummy/url'],
      {
        queryParams: {
          source: item.source,
        }
      });
  });


  // navigateToProductDetails relative
  it('should return smart-choice-voucher url when navigateToProductDetails is called productType with SMART_CHOICE_VOUCHER', () => {
    const item = {
      productType: ProductTypeEnum.SMART_CHOICE_VOUCHER,
      productId: 1
    }

    const url = component.navigateToProductDetails(item);
    fixture.detectChanges();
    expect(url).toBe('products/product/edit/smart-choice-voucher/1');
  });

  it('should return super-voucher url when navigateToProductDetails is called productType with SUPER_VOUCHER', () => {
    const item = {
      productType: ProductTypeEnum.SUPER_VOUCHER,
      productId: 1
    }
    const url = component.navigateToProductDetails(item);
    fixture.detectChanges();
    expect(url).toBe('products/product/edit/super-voucher/1');
  });

  it('should return normal product url when navigateToProductDetails is called productType with DYNAMIC_FACEVALUE', () => {
    const item = {
      productType: ProductTypeEnum.DYNAMIC_FACEVALUE,
      productId: 1
    }
    const url = component.navigateToProductDetails(item);
    fixture.detectChanges();
    expect(url).toBe('products/1');
  });

  it('should return normal product url when navigateToProductDetails is called productType with PRODUCT_BASED', () => {
    const item = {
      productType: ProductTypeEnum.PRODUCT_BASED,
      productId: 1
    }
    // mock router to control routing
    const url = component.navigateToProductDetails(item);
    fixture.detectChanges();
    expect(url).toBe('products/1');
  });

  it('should return normal product url when navigateToProductDetails is called productType with SMART_BOOKLET', () => {
    const item = {
      productType: ProductTypeEnum.SMART_BOOKLET,
      productId: 1
    }
    // mock router to control routing
    const url = component.navigateToProductDetails(item);
    fixture.detectChanges();
    expect(url).toBe('products/1');
  });

  it('should return normal product url when navigateToProductDetails is called productType with VALUE_BASED', () => {
    const item = {
      productType: ProductTypeEnum.VALUE_BASED,
      productId: 1
    }
    const url = component.navigateToProductDetails(item);
    fixture.detectChanges();
    expect(url).toBe('products/1');
  });

  // calPageInfo related
  it('should set itemEnd same as total when calPageInfo is called  and currentPage is same as pageCount ', () => {
    component.pageInfo.pageSize = 20;
    component.pageInfo.itemEnd = 20
    fixture.detectChanges();
    component.calPageInfo(20);
    expect(component.pageInfo.itemEnd).toEqual(component.pageInfo.total);
  });

  it('should set itemEnd same as total when calPageInfo is called', () => {
    component.pageInfo.pageSize = 20;
    component.pageInfo.itemEnd = 50
    fixture.detectChanges();
    component.calPageInfo(40);
    expect(component.pageInfo.itemEnd).toEqual(component.pageInfo.pageSize);
  });

  // convertDateToNgbDate
  it('should return ngbdate when convertDateToNgbDate is called ', () => {
    const date = component.convertDateToNgbDate(new Date('2022/12/15'));
    const expectNgbDate = {
      year: 2022,
      month: 12,
      day: 15,
    }
    expect(date).toEqual(expectNgbDate);
  });

  // toggleCollapsibleTable related
  it('should set isExpanded as false when toggleCollapsibleTable is called with isExpanded is true', () => {
    component.isExpanded = true;
    component.toggleCollapsibleTable();
    expect(component.isExpanded).toBeFalse;
  });

  it('should set isExpanded as true when toggleCollapsibleTable is called with isExpanded is false', () => {
    component.isExpanded = false;
    component.toggleCollapsibleTable();
    expect(component.isExpanded).toBeTrue;
  });

  it('should call  when toggleCollapsibleTable is called with isExpanded is false and productList.length is not equal to productListTotalCount', () => {
    component.isExpanded = false;
    component.productList = [1, 2];
    component.productListTotalCount = 5;
    fixture.detectChanges();
    component.toggleCollapsibleTable();
    expect(component.getProductList).toHaveBeenCalled;
  });

  it('should set isExpanded as true when toggleCollapsibleTable is called with isExpanded is false', () => {
    const dummyProductList = [
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      }
      ,
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code 10',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000 10',
      },
      {
        productId: 2571,
        productType: 1,
        productCode: 'Dummy product code',
        productName: 'Dummy (EDENRED) 7-11 Virtual e-Gift Card 1,000',
      }
    ];
  });

  it('should set isExpanded as true when toggleCollapsibleTable is called with isExpanded is false', () => {
    const dummyInventoryList = [
      {
        availableStartDate: new Date('2021/10/28'),
        availableEndDate: new Date('2021/10/28'),
        expiryDate: new Date('10/28/2021 11:59:59'),
        trustAccountEndDate: null,
        inStockQty: 110,
        reservationCode: '001123000',
        source: 0,
      },
      {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123001',
        source: 0,
      },
      {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123002',
        source: 2,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123003',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123004',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123005',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123006',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123007',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123008',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123009',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123010',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123011',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123012',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123013',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123014',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123015',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123016',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123017',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123018',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123019',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123020',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123021',
        source: 0,
      }, {
        availableStartDate: '10/7/2021',
        availableEndDate: '11/28/2021',
        expiryDate: '10/28/2021 11:59:59 PM',
        trustAccountEndDate: '5/5/2022',
        inStockQty: 55,
        reservationCode: '001123022',
        source: 0,
      },
    ];
  });

});
