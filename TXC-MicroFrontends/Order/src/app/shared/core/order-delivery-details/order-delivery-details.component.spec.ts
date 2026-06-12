import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveryDetailsComponent } from './order-delivery-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WizardService } from 'src/app/order/services/wizard.service';

describe('OrderDeliveryDetailsComponent', () => {
  const wizardSvcSpy = jasmine.createSpyObj('WizardService', [
    'checkFormValidation',
  ]);
  let component: OrderDeliveryDetailsComponent;
  let fixture: ComponentFixture<OrderDeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDeliveryDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: WizardService,
          useValue: wizardSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
