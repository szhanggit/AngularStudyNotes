import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoucherListComponent, VoucherRelatedData } from './voucher-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule, NgbTooltipModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { Tenant, TenantConfigService } from '../../service/tenant-config.service';
import { VoucherStatusEnum } from '../../enum/voucher-status.enum';

class MockTenantConfigService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}

@Component({
  selector: 'ngbd-toast-global',
  template: ''
})
class MockToastComponent {
  showSuccess() {};
  showDanger() {};
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

describe('VoucherListComponent', () => {
  let component: VoucherListComponent;
  let fixture: ComponentFixture<VoucherListComponent>;

  const dummyVoucherList = [
    {
      voucherId: 111,
      voucherNumber: '5622090000799',
      orderNumber: '202212067430',
      productName: 'Carrefour $1,000 voucher',
      clientName: 'Naomie Client',
      email: '',
      mobile: '',
      alias: 'Aw0qpKw0bb6',
      publishDate: '2022/12/01 1:40:33 PM',
      activateDate: '2022/12/01 1:40:33 PM',
      voucherSatus: 'Issued',
      distributionEmailStatus: '',
      distributionSmsStatus: '',
      tick: false,
      productType: 1,
      productId: 2571,
      orderId: 14340,
      clientId: 3495,
      clientCode: 700000000001252,
    },
    {
      voucherId: 122,
      voucherNumber: '120006',
      orderNumber: '202212067430',
      productName: 'Carrefour $1,000 voucher',
      clientName: 'Naomie Client',
      email: 'naomie.lin@edenred.com',
      mobile: '0988777666',
      alias: 'Aw0qpKw0bb6',
      publishDate: '2022/12/01 1:40:33 PM',
      activateDate: '2022/12/01 1:40:33 PM',
      voucherSatus: 'Issued',
      distributionEmailStatus: 'Sent Success',
      distributionSmsStatus: 'Sent Success',
      tick: false,
      productType: 1,
      productId: 2571,
      orderId: 14340,
      clientId: 3495,
      clientCode: 700000000001252,
    },
    {
      voucherId: 333,
      voucherNumber: '5622090000799',
      orderNumber: '202212067430',
      productName: 'Carrefour $1,000 voucher',
      clientName: 'Naomie Client',
      email: '',
      mobile: '',
      alias: 'Aw0qpKw0bb6',
      publishDate: '2022/12/01 1:40:33 PM',
      activateDate: '2022/12/01 1:40:33 PM',
      voucherSatus: 'Trashed',
      distributionEmailStatus: '',
      distributionSmsStatus: '',
      tick: false,
      productType: 1,
      productId: 2571,
      orderId: 14340,
      clientId: 3495,
      clientCode: 700000000001252,
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VoucherListComponent,
        mockPipe('maskWithStar'),
        mockPipe('txcLocalDateTime'),
        MockToastComponent,
        // ReactiveFormsModule,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbCollapseModule,
        NgbTooltipModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        FormBuilder,
        { provide: TenantConfigService, useClass: MockTenantConfigService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(VoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectAll as false when all items in selectedList is not tick', () => {
    const dummyVoucherList: VoucherRelatedData[] = [
      {
        voucherId: 1,
        voucherNumber: '111',
        tick: true,
        email: '',
        mobile: '',
        voucherSatus: VoucherStatusEnum.ACTIVATED,
      },
      {
        voucherId: 2,
        voucherNumber: '222',
        tick: false,
        email: '',
        mobile: '',
        voucherSatus: VoucherStatusEnum.ACTIVATED,
      }
    ];
    component.voucherList = dummyVoucherList;
    component.tickToggle(0);
    fixture.detectChanges();
    expect(component.selectAll).toBeFalse();
  });

  it('should set selectAll as true and all "tick" in voucherList as true when onSelectAll is tick', () => {
    const dummyVoucherList: VoucherRelatedData[] = [
      {
        voucherId: 1,
        voucherNumber: '111',
        tick: true,
        email: '',
        mobile: '',
        voucherSatus: VoucherStatusEnum.ACTIVATED,
      },
      {
        voucherId: 2,
        voucherNumber: '222',
        tick: false,
        email: '',
        mobile: '',
        voucherSatus: VoucherStatusEnum.ACTIVATED,
      }
    ];
    component.selectAll = false;
    component.voucherList = dummyVoucherList;
    component.onSelectAll();
    fixture.detectChanges();
    expect(component.selectAll).toBeTrue();
    expect(component.voucherList.filter(e => e.tick === true).length).toBe(2);
  });

  it('should set selectAll as false and all "tick" in voucherList as false when onSelectAll is not tick', () => {
    const dummyVoucherList: VoucherRelatedData[] = [
      {
        voucherId: 1,
        voucherNumber: '111',
        tick: true,
        email: '',
        mobile: '',
        voucherSatus: VoucherStatusEnum.ACTIVATED,
      },
      {
        voucherId: 2,
        voucherNumber: '222',
        tick: false,
        email: '',
        mobile: '',
        voucherSatus: VoucherStatusEnum.ACTIVATED,
      }
    ];
    component.selectAll = true;
    component.voucherList = dummyVoucherList;
    component.onSelectAll();
    fixture.detectChanges();
    expect(component.selectAll).toBeFalse();
    expect(component.voucherList.filter(e => e.tick === true).length).toBe(0);
  });

  // SINGLE_RESULT_CONDITIONS
  it('should call resetMultiConditions and disableMultiConditions when onSearchOptionChange() is called with VOUCHER_NUMBER', () => {
    component.resetMultiConditions = jasmine.createSpy();
    component.disableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.VOUCHER_NUMBER);
    expect(component.resetMultiConditions).toHaveBeenCalled();
    expect(component.disableMultiConditions).toHaveBeenCalled();
    expect(component.searchPlaceholder).toBe('Enter voucher number')
  });

  it('should call resetMultiConditions and disableMultiConditions when onSearchOptionChange() is called with SHORT_URL', () => {
    component.resetMultiConditions = jasmine.createSpy();
    component.disableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.ALIAS);
    expect(component.resetMultiConditions).toHaveBeenCalled();
    expect(component.disableMultiConditions).toHaveBeenCalled();
    expect(component.searchPlaceholder).toBe('Enter alias')
  });

  it('should call resetMultiConditions and disableMultiConditions when onSearchOptionChange() is called with VOUCHER_GUID', () => {
    component.resetMultiConditions = jasmine.createSpy();
    component.disableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.VOUCHER_GUID);
    expect(component.resetMultiConditions).toHaveBeenCalled();
    expect(component.disableMultiConditions).toHaveBeenCalled();
    expect(component.searchPlaceholder).toBe('Enter guid')
  });

  it('should call resetMultiConditions and disableMultiConditions when onSearchOptionChange() is called with ECODE', () => {
    component.resetMultiConditions = jasmine.createSpy();
    component.disableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.ECODE);
    expect(component.resetMultiConditions).toHaveBeenCalled();
    expect(component.disableMultiConditions).toHaveBeenCalled();
    expect(component.searchPlaceholder).toBe('Enter eCode')
  });

  // MULTI_RESULTS_CONDITIONS
  it('should call enableMultiConditions when onSearchOptionChange() is called with GR_ORDER_ID', () => {
    component.enableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.GR_ORDER_ID);
    expect(component.searchPlaceholder).toBe('Enter GR order ID')
    expect(component.enableMultiConditions).toHaveBeenCalled();
  });

  it('should call enableMultiConditions when onSearchOptionChange() is called with RCN', () => {
    component.enableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.CORRELATION_ID);
    expect(component.searchPlaceholder).toBe('Enter correlation ID')
    expect(component.enableMultiConditions).toHaveBeenCalled();
  });

  it('should call enableMultiConditions when onSearchOptionChange() is called with CLIENT_ORDER_NUMBER', () => {
    component.enableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.CLIENT_ORDER_NUMBER);
    expect(component.searchPlaceholder).toBe('Enter client order number');
    expect(component.enableMultiConditions).toHaveBeenCalled();
  });

  it('should call enableMultiConditions when onSearchOptionChange() is called with MOBILE', () => {
    component.enableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.MOBILE);
    expect(component.searchPlaceholder).toBe('Enter mobile')
    expect(component.enableMultiConditions).toHaveBeenCalled();
  });

  it('should call enableMultiConditions when onSearchOptionChange() is called with EMAIL', () => {
    component.enableMultiConditions = jasmine.createSpy();
    component.onSearchOptionChange(component.searchTermsEnum.EMAIL);
    expect(component.searchPlaceholder).toBe('Enter email')
    expect(component.enableMultiConditions).toHaveBeenCalled();
  });

  it('should show toast when resendVoucher is called', () => {
    component.toast = {
      showSuccess: jasmine.createSpy()
    } as unknown as any;
    fixture.detectChanges();
    component.resendVoucher();
    expect(component.toast.showSuccess).toHaveBeenCalledWith("Resending request is successful, please wait a while.");
  });

  it('should enable voucherStatus, emailStatus, smsStatus and productName when enableMultiConditions is called', () => {
    component.enableMultiConditions();
    expect(component.searchTermFormGroup.get('voucherStatus')?.enabled).toBeTrue();
    expect(component.searchTermFormGroup.get('emailStatus')?.enabled).toBeTrue();
    expect(component.searchTermFormGroup.get('smsStatus')?.enabled).toBeTrue();
    expect(component.searchTermFormGroup.get('productName')?.enabled).toBeTrue();
  });

});
