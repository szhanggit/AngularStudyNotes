import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTypeComponent } from './quotation-type.component';

describe('QuotationTypeComponent', () => {
  let component: QuotationTypeComponent;
  let fixture: ComponentFixture<QuotationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotationTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationTypeComponent);
    component = fixture.componentInstance;
    component.selectedMode = { key: 1, value: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectType', () => {
    it('should return if same type', () => {
      // arrange
      const expectedType = { key: 1, value: 'test' };

      // act
      component.selectType(expectedType);

      // assert
      expect(component.selectedMode).toEqual(expectedType);
    });

    it('should update if not same type', () => {
        // arrange
        const expectedType = { key: 2, value: 'test' };
  
        // act
        component.selectType(expectedType);
  
        // assert
        expect(component.selectedMode).toEqual(expectedType);
      });
  });
});
