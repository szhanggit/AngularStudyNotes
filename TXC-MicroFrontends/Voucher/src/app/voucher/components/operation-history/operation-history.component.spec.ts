import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationHistoryComponent } from './operation-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule, NgbNavModule, NgbTooltipModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TenantConfigService } from '../../service/tenant-config.service';

describe('OperationHistoryComponent', () => {
  let component: OperationHistoryComponent;
  let fixture: ComponentFixture<OperationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationHistoryComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbCollapseModule, 
        NgbNavModule,
        NgbTooltipModule,
        
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        FormBuilder,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
