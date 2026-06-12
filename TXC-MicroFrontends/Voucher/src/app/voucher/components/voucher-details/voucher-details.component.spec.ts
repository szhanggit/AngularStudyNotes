import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDetailsComponent } from './voucher-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule, NgbTooltipModule, NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, Pipe, PipeTransform, TemplateRef } from '@angular/core';
import { Tenant, TenantConfigService } from '../../service/tenant-config.service';
import { VoucherStatusTagComponent } from '../voucher-status-tag/voucher-status-tag.component';
import { Router, Routes } from '@angular/router';

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


class MockTenantConfigService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}
@Component({
  selector: 'voucher-status-tag',
  template: '<span>Mock tag</span>'
})
class  MockVoucherStatusTagComponent {
  @Input() status: string = ''
}

@Component({
  selector: 'ngbd-toast-global',
  template: ''
})
class MockToastComponent {
  showSuccess() {};
  showDanger() {};
}

describe('VoucherDetailsComponent', () => {
  let component: VoucherDetailsComponent;
  let fixture: ComponentFixture<VoucherDetailsComponent>;
  let mockTooltip: jasmine.SpyObj<NgbTooltip>;
  mockTooltip = jasmine.createSpyObj(['isOpen', 'open', 'close']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VoucherDetailsComponent,
        MockVoucherStatusTagComponent,
        MockToastComponent,
        mockPipe('maskWithStar'),
        mockPipe('producttype'),
        mockPipe('txcLocalDateTime'),
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
        { provide: TenantConfigService, useClass: MockTenantConfigService},
        { provide: VoucherStatusTagComponent, useClass: MockVoucherStatusTagComponent},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(VoucherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const list = [
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.ACTIVATED,
        voucherNumber: 2022120674303,
        voucherStatus: component.voucherStatusEnum.ACTIVATED,
        productName: 'Dummy product name - ACTIVATED - ACTIVATED',
        faceValue: 200,
        remainingBalance: 200,
        associationStatus: 'Associated',
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 111,
        masterVoucherStatus: component.voucherStatusEnum.ACTIVATED,
        voucherNumber: 20221206743088,
        voucherStatus: component.voucherStatusEnum.USED,
        productName: 'Dummy product name -ACTIVATED - Used',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 111,
        masterVoucherStatus: component.voucherStatusEnum.TRASHED,
        voucherNumber: 202212067430,
        voucherStatus: component.voucherStatusEnum.TRASHED,
        productName: 'Dummy product name -Trashed - Trashed',
        associationStatus: 'Disassociated',
        faceValue: 200,
        remainingBalance: 0,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 111,
        masterVoucherStatus: component.voucherStatusEnum.TRASHED,
        voucherNumber: 202212067430,
        voucherStatus: component.voucherStatusEnum.TRASHED,
        productName: 'Dummy product name -Trashed - Trashed',
        associationStatus: 'Expired return',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 111,
        masterVoucherStatus: component.voucherStatusEnum.USED,
        voucherNumber: 20221206743061,
        voucherStatus: component.voucherStatusEnum.ACTIVATED,
        productName: 'Dummy product name -Used - Activated',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.USED,
        voucherNumber: 20221206743050,
        voucherStatus: component.voucherStatusEnum.USED,
        productName: 'Dummy product name -Used - Used',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.USED,
        voucherNumber: 20221206743099,
        voucherStatus: component.voucherStatusEnum.BLOCKED,
        productName: 'Dummy product name -Used - Blocked',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.USED,
        voucherNumber: 2022120674308,
        voucherStatus: component.voucherStatusEnum.EXPIRED,
        productName: 'Dummy product name -Used - Expired',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.BLOCKED,
        voucherNumber: 2022120674307,
        voucherStatus: component.voucherStatusEnum.ACTIVATED,
        productName: 'Dummy product name -Blocked - Activated',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.BLOCKED,
        voucherNumber: 2022120674306,
        voucherStatus: component.voucherStatusEnum.USED,
        productName: 'Dummy product name -Blocked - Used',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.BLOCKED,
        voucherNumber: 2022120674305,
        voucherStatus: component.voucherStatusEnum.BLOCKED,
        productName: 'Dummy product name -Blocked - Blocked',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 100,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.BLOCKED,
        voucherNumber: 2022120674304,
        voucherStatus: component.voucherStatusEnum.EXPIRED,
        productName: 'Dummy product name -Blocked - Expired',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.EXPIRED,
        voucherNumber: 202212440,
        voucherStatus: component.voucherStatusEnum.ACTIVATED,
        productName: 'Dummy product name -Expired - Activated',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.EXPIRED,
        voucherNumber: 20221206220,
        voucherStatus: component.voucherStatusEnum.USED,
        productName: 'Dummy product name -Expired - Used',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.EXPIRED,
        voucherNumber: 202212067420,
        voucherStatus: component.voucherStatusEnum.BLOCKED,
        productName: 'Dummy product name -Expired - Blocked',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
      {
        masterVoucherNumber: 5622090000799,
        voucherId: 122,
        masterVoucherStatus: component.voucherStatusEnum.EXPIRED,
        voucherNumber: 202212067410,
        voucherStatus: component.voucherStatusEnum.EXPIRED,
        productName: 'Dummy product name -Expired - Expired',
        associationStatus: 'Associated',
        faceValue: 200,
        remainingBalance: 200,
      },
  
    ]
  });

  // Tooltips related
  it('should show when hidden', () => {
    const fc: any = {};
    mockTooltip.isOpen.and.returnValue(false);
    component.toggleTooltipWithContext(mockTooltip, fc);
    expect(mockTooltip.open).toHaveBeenCalled();
  });

  it('should hide when displayed', () => {
    const fc: any = {};
    mockTooltip.isOpen.and.returnValue(true);
    component.toggleTooltipWithContext(mockTooltip, fc);
    expect(mockTooltip.close).toHaveBeenCalled();
  });

  // openDistributionModal related
  it('should set editType-email as email when openDistributionModal() is called', () => {
    component.editEmailOrPhoneForm.get('email')?.setValue('TEST@gmail.com');
    fixture.detectChanges();
    component.openDistributionModal(component.editEmailOrPhoneTemplate, 'md', component.distributionTypeEnum.EMAIL);
    expect(component.editType).toBe(component.distributionTypeEnum.EMAIL);
  });

  it('should set editType-mobile as mobile when openDistributionModal() is called', () => {
    component.editEmailOrPhoneForm.get('mobile')?.setValue('TEST@gmail.com');
    fixture.detectChanges();
    component.openDistributionModal(component.editEmailOrPhoneTemplate, 'md', component.distributionTypeEnum.MOBILE);
    expect(component.editType).toBe(component.distributionTypeEnum.MOBILE);
  });

  it('should call success toast when resend() is called with type email', () => {
    component.distributionConfig.email ='TEST@gmail.com';
    component.toast = {
      showSuccess: jasmine.createSpy()
    } as unknown as any;
    fixture.detectChanges();
    component.refresh(component.distributionTypeEnum.EMAIL);
    expect(component.toast.showSuccess).toHaveBeenCalledWith(`You've successfully updated the distribution status.`);
  });

  it('should call success toast when resend() is called with type mobile', () => {
    component.distributionConfig.mobile ='0912345678';
    component.toast = {
      showSuccess: jasmine.createSpy()
    } as unknown as any;
    fixture.detectChanges();
    component.refresh(component.distributionTypeEnum.MOBILE);
    expect(component.toast.showSuccess).toHaveBeenCalledWith(`You've successfully updated the distribution status.`);
  });

  it('should set voucherMemo as updateMemoContent when openModal() is called', () => {
    const dummyContent = 'DUMMY MEMO 1.0'
    component.voucherMemo = dummyContent;
    fixture.detectChanges();
    component.openModal(component.editEmailOrPhoneTemplate, 'md');
    expect(component.updateMemoContent).toBe(dummyContent);
  });

  it('should set showMaskEmail as true when eyeSwitcher is called with distributionTypeEnum.EMAIL and original showMaskEmail is false', () => {
    component.showMaskEmail = false;
    component.eyeSwitcher(component.distributionTypeEnum.EMAIL);
    fixture.detectChanges();
    expect(component.showMaskEmail).toBeTrue();
  });

  it('should set showMaskEmail as false when eyeSwitcher is called with distributionTypeEnum.EMAIL and original showMaskEmail is true', () => {
    component.showMaskEmail = true;
    component.eyeSwitcher(component.distributionTypeEnum.EMAIL);
    fixture.detectChanges();
    expect(component.showMaskEmail).toBeFalse();
  });

  it('should set showMaskMobile as true when eyeSwitcher is called with distributionTypeEnum.MOBILE and original showMaskMobile is false', () => {
    component.showMaskMobile  = false;
    component.eyeSwitcher(component.distributionTypeEnum.MOBILE);
    fixture.detectChanges();
    expect(component.showMaskMobile).toBeTrue();
  });

  it('should set showMaskMobile as false when eyeSwitcher is called with distributionTypeEnum.MOBILE and original showMaskMobile is true', () => {
    component.showMaskMobile  = true;
    component.eyeSwitcher(component.distributionTypeEnum.MOBILE);
    fixture.detectChanges();
    expect(component.showMaskMobile).toBeFalse();
  });

  it('should navigate to the page when navigateTo is called', () => {
    const item = {
      source: 1
    }
    // mock router to control routing
    let mockRouter: Router;
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    component.navigateTo('dummy/url');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['dummy/url']);
  });

  it('should navigate to the page when navigateToVoucherDetails is called', () => {
    const item = {
      voucherGuid: '123',
      skuId: 1,
      source: 'source',
    }
    const url =  component.navigateToVoucherDetails(item);
    expect(url).toEqual('voucher/voucher-details/123');
  });
  
});


