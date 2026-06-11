import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuCreateDraftDetailsComponent } from './sku-create-draft-details.component';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tenant } from 'src/app/merchant/models/tenant.model';

class MockTenantConfigService {
  getTenant(): Tenant {
    return {
      id: 7,
      name: 'TW',
    }
  }
}

describe('SkuCreateDraftDetailsComponent', () => {
  let component: SkuCreateDraftDetailsComponent;
  let fixture: ComponentFixture<SkuCreateDraftDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkuCreateDraftDetailsComponent ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: TenantConfigService, useClass: MockTenantConfigService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuCreateDraftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
