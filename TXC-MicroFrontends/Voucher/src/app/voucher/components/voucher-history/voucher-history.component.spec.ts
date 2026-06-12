import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoucherHistoryComponent } from './voucher-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule, NgbTooltipModule, NgbModal, NgbNavModule, NgbNavChangeEvent, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tenant, TenantConfigService } from '../../service/tenant-config.service';
import { VoucherApiService } from '../../service/voucher-api.service';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '../../service/base-response.model';
import { Pipe, PipeTransform } from '@angular/core';

class MockTenantConfigService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
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

class MockVoucherApiService {
  getVoucherHistoryDetailsByVoucherIds(): Observable<BaseResponse> {
    const baseResponse: BaseResponse = {
      data: "{\"denormalizedTransition\":{\"totalCount\":2,\"items\":[{\"id\":1,\"voucherId\":1,\"voucherIdPartitionNumber\":948,\"merchantId\":2,\"shopId\":3,\"amount\":100,\"actionTime\":\"1970-01-01T00:00:00Z\",\"action\":\"Action\",\"tranCode\":\"TranCode\",\"operator\":\"Operator\",\"rsv1\":\"RSV1\",\"businessDate\":\"1970-01-01T00:00:00Z\"},{\"id\":4,\"voucherId\":1,\"voucherIdPartitionNumber\":948,\"merchantId\":2,\"shopId\":3,\"amount\":100,\"actionTime\":\"2023-11-10T00:00:00Z\",\"action\":\"Happy Path\",\"tranCode\":\"TranCode\",\"operator\":\"Operator\",\"rsv1\":\"RSV1\",\"businessDate\":\"2023-11-10T00:00:00Z\"}]}}",
      message: '',
      success: true
  }
    return of(baseResponse);
  }
}

describe('VoucherHistoryComponent', () => {
  let component: VoucherHistoryComponent;
  let fixture: ComponentFixture<VoucherHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VoucherHistoryComponent,
        mockPipe('txcLocalDateTime'),
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbCollapseModule, 
        NgbNavModule,
      ],
      providers: [
        NgbModal,
        NgbActiveModal,
        FormBuilder,
        { provide: TenantConfigService, useClass: MockTenantConfigService },
        { provide: VoucherApiService, useClass: MockVoucherApiService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(VoucherHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentTab when tab is changed', () => {
    component.ngAfterViewInit();
    const event: NgbNavChangeEvent<any> = {
      activeId: 2,
      nextId: 1,
      preventDefault: () => {}
    };
    component.nav.navChange.next(event)
    expect(component.currentTab).toBe(1);
  });

});
