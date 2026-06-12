import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListSummaryComponent } from './product-list-summary.component';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { of } from 'rxjs';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';

describe('ProductListSummaryComponent', () => {
  let component: ProductListSummaryComponent;
  let fixture: ComponentFixture<ProductListSummaryComponent>;
  let quotationStateService: jasmine.SpyObj<QuotationStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListSummaryComponent],
      providers: [
        {
          provide: QuotationStateService,
          useValue: jasmine.createSpyObj('QuotationStateService', [''], {
            selectedOrderMode$: of(),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListSummaryComponent);
    component = fixture.componentInstance;
    quotationStateService = TestBed.inject(
      QuotationStateService
    ) as jasmine.SpyObj<QuotationStateService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign selectedOrderMode on init', () => {
    // arrrange
    const mockSelectedOrderMode = { key: 4, value: '' };
    spyOn(quotationStateService.selectedOrderMode$, 'pipe').and.returnValue(
      of(mockSelectedOrderMode)
    );

    // act
    component.ngOnInit();

    // assert
    expect(component.selectedOrderMode).toEqual(mockSelectedOrderMode);
  });

  describe('showEmailSmsQuantity', () => {
    const testData = [
      {
        expected: true,
        orderMode: { key: 4, value: '' },
      },
      {
        expected: false,
        orderMode: { key: 1, value: '' },
      },
    ];

    testData.forEach((data) => {
      it(`should return ${data.expected} if selectedOrderMode.key is not in withEmailSmsQuantity`, () => {
        // arrange
        component.selectedOrderMode = data.orderMode;
        component.withEmailSmsQuantity = [OrderModeEnum.PaperVoucher];

        // act
        const result = component.showEmailSmsQuantity;

        // assert
        expect(result).toBe(data.expected);
      });
    });
  });
});
