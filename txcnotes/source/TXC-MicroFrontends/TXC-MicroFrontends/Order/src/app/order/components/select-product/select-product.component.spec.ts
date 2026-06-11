import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { SelectProductComponent } from './select-product.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { BusinessUnitEnum } from 'src/app/shared/enums/tenant.enum';
import { ExpirySchemeTypeEnum } from 'src/app/shared/enums/expiry-scheme-type.enum';
import { of } from 'rxjs';

describe('SelectProductComponent', () => {
  let component: SelectProductComponent;
  let fixture: ComponentFixture<SelectProductComponent>;

  // mock local storage
  let store: any = {};
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectProductComponent],
      imports: [HttpClientTestingModule, NgbTypeaheadModule],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    const tenant = {
      tenantId: 7,
      name: 'TW',
    };
    localStorage.setItem('tenant', JSON.stringify(tenant));

    fixture = TestBed.createComponent(SelectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TITLE', () => {
    it('should return Select Product if not edit mode', () => {
      // arrange
      const expectedTitle = 'Select Product';
      component.editMode = false;

      // act
      const result = component.TITLE;

      // assert
      expect(result).toBe(expectedTitle);
    });

    it('should return Edit Product details if edit mode', () => {
      // arrange
      const expectedTitle = 'Edit Product details';
      component.editMode = true;

      // act
      const result = component.TITLE;

      // assert
      expect(result).toBe(expectedTitle);
    });
  });

  describe('productTypeEnum', () => {
    it('should return ProductTypeEnum', () => {
      // act
      const result = component.productTypeEnum;

      // assert
      expect(result).toBe(ProductTypeEnum);
    });
  });

  describe('productFormatter', () => {
    it('should return product name', () => {
      // act
      const result = component.productFormatter({ productName: 'test' } as any);

      // assert
      expect(result).toBe('test');
    });
  });

  describe('initializeControlValidity', () => {
    it('should add validators on voucher quantity', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;

      // act
      component.initializeControlValidity();

      // assert
      expect(
        component.voucherQuantity?.hasValidator(Validators.required)
      ).toBeTrue();
    });

    it('should disable dfv form', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;

      // act
      component.initializeControlValidity();

      // assert
      expect(component.dfvDetailsFormGroup.disabled).toBeTrue();
    });

    it('should disable all trust account form', () => {
      // arrange
      component.selectedTenant = BusinessUnitEnum.India;
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;

      // act
      component.initializeControlValidity();

      // assert
      Object.keys(component.trustAccountFormGroup.controls).forEach(
        (controlName) => {
          expect(
            (component.trustAccountFormGroup.get(controlName) as FormControl)
              .disabled
          ).toBeTrue();
        }
      );
    });
  });

  describe('initializeOnEdit', () => {
    it('should patch value when edit mode and product is defined', fakeAsync(() => {
      // arrange
      const patchValueSpy = spyOn(
        component.productDetailsFormGroup,
        'patchValue'
      );
      const expectedProduct = {
        productType: ProductTypeEnum.DynamicFaceValue,
        expiryDate: new Date(),
        dfvQuantity: [
          {
            faceValue: 10,
            voucherQuantity: 10,
          },
        ],
        trustAccount: { trustExpiryDate: new Date() },
        faceValueRange: '1 to 20',
      } as any;
      component.selectedProduct = expectedProduct;
      component.product = expectedProduct;
      component.editMode = true;

      // act
      component.initializeOnEdit();
      tick();

      // assert
      expect(patchValueSpy).toHaveBeenCalledWith(expectedProduct, {
        emitEvent: false,
        onlySelf: true,
      });
    }));

    it('should patch value when edit mode and product is defined and disable dfv when Direct Non API', fakeAsync(() => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;
      const patchValueSpy = spyOn(
        component.productDetailsFormGroup,
        'patchValue'
      );
      const expectedProduct = {
        productType: ProductTypeEnum.DynamicFaceValue,
        expiryDate: new Date(),
        dfvQuantity: [
          {
            faceValue: 10,
            voucherQuantity: 10,
          },
        ],
        trustAccount: { trustExpiryDate: new Date() },
        faceValueRange: '1 to 20',
      } as any;
      component.selectedProduct = expectedProduct;
      component.product = expectedProduct;
      component.editMode = true;

      // act
      component.initializeOnEdit();
      tick();

      // assert
      expect(patchValueSpy).toHaveBeenCalledWith(expectedProduct, {
        emitEvent: false,
        onlySelf: true,
      });
      expect(component.dfvDetailsFormGroup.disabled).toBeTrue();
    }));
  });

  describe('listenOnTrustAccountFormGroupChange', () => {
    it('should should patch value of trust amount for Default value', () => {
      // arrange
      const expectedProduct = {
        trustAccount: {
          trustAmount: 20,
        },
      } as any;
      component.selectedProduct = expectedProduct;
      const trustAccountControl =
        component.trustAccountFormGroup.get('trustAccountOption');
      const trustAmountControl =
        component.trustAccountFormGroup.get('trustAmount');

      // act
      trustAccountControl?.setValue('Default');

      // assert
      expect(trustAmountControl?.value).toBe(
        expectedProduct.trustAccount.trustAmount
      );
    });

    it('should should patch value to null for Custom value', () => {
      // arrange
      const expectedProduct = {
        trustAccount: {
          trustAmount: 20,
        },
      } as any;
      component.selectedProduct = expectedProduct;
      const trustAccountControl =
        component.trustAccountFormGroup.get('trustAccountOption');
      const trustAmountControl =
        component.trustAccountFormGroup.get('trustAmount');

      // act
      trustAccountControl?.setValue('Custom');

      // assert
      expect(trustAmountControl?.value).toBeFalsy();
    });
  });

  describe('listenOnProductNameFormGroupChange', () => {
    it('should call onProductReset and onDfvDetailsReset and dfvForm should be enabled', () => {
      // arrange
      const onProductResetSpy = spyOn(component, 'onProductReset');
      const onDfvDetailsResetSpy = spyOn(component, 'onDfvDetailsReset');

      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;
      const expectedProduct = {
        productType: ProductTypeEnum.DynamicFaceValue,
        expiryDate: new Date(),
        dfvQuantity: [
          {
            faceValue: 10,
            voucherQuantity: 10,
          },
        ],
        trustAccount: { trustExpiryDate: new Date() },
        faceValueRange: '1 to 20',
      } as any;
      const productNameFormGroup = component.productNameFormGroup;
      component.selectedProduct = expectedProduct;

      // act
      productNameFormGroup.setValue({
        productName: expectedProduct,
      });

      // assert
      expect(onProductResetSpy).toHaveBeenCalled();
      expect(onDfvDetailsResetSpy).toHaveBeenCalled();
      expect(component.dfvDetailsFormGroup.disabled).toBeFalse();
    });

    it('should call onProductReset and onDfvDetailsReset and dfvForm should be disabled', () => {
      // arrange
      const onProductResetSpy = spyOn(component, 'onProductReset');
      const onDfvDetailsResetSpy = spyOn(component, 'onDfvDetailsReset');

      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;
      const expectedProduct = {
        productType: ProductTypeEnum.DynamicFaceValue,
        expiryDate: new Date(),
        dfvQuantity: [
          {
            faceValue: 10,
            voucherQuantity: 10,
          },
        ],
        trustAccount: { trustExpiryDate: new Date() },
        faceValueRange: '1 to 20',
      } as any;
      const productNameFormGroup = component.productNameFormGroup;
      component.selectedProduct = expectedProduct;

      // act
      productNameFormGroup.setValue({
        productName: expectedProduct,
      });

      // assert
      expect(onProductResetSpy).toHaveBeenCalled();
      expect(onDfvDetailsResetSpy).toHaveBeenCalled();
      expect(component.dfvDetailsFormGroup.disabled).toBeTrue();
    });
  });

  describe('disableDfvFormGroup()', () => {
    it('should disable dfv form', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;

      // act
      component.disableDfvFormGroup();

      // assert
      expect(component.dfvDetailsFormGroup.disabled).toBeTrue();
    });

    it('should add validators', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;

      // act
      component.disableDfvFormGroup();

      // assert
      expect(component.dfvDetailsFormGroup.disabled).toBeTrue();
      expect(component.voucherQuantity?.disabled).toBeFalse();
      expect(
        component.voucherQuantity?.hasValidator(Validators.required)
      ).toBeTrue();
    });
  });

  it('onProductReset should reset form group', () => {
    // arrange
    const onProductResetSpy = spyOn(component.productDetailsFormGroup, 'reset');
    const expirySchemeControl =
      component.productDetailsFormGroup.get('expiryScheme');
    const isShortUrlNeededControl =
      component.productDetailsFormGroup.get('isShortUrlNeeded');

    // act
    component.onProductReset();

    // assert
    expect(onProductResetSpy).toHaveBeenCalled();
    expect(expirySchemeControl?.value).toBeFalsy();
    expect(isShortUrlNeededControl?.value).toBeFalsy();
  });

  it('onDfvDetailsReset should reset form group', () => {
    // arrange
    const dfvDetailsResetSpy = spyOn(component.dfvDetailsFormGroup, 'reset');

    // act
    component.onDfvDetailsReset();

    // assert
    expect(dfvDetailsResetSpy).toHaveBeenCalled();
  });

  it('onTrustAccountDetailsSet should patch value', fakeAsync(() => {
    // arrange
    const trustAccountPatchSpy = spyOn(
      component.trustAccountFormGroup,
      'patchValue'
    );

    // act
    component.onTrustAccountDetailsSet({
      trustAccount: { isTrustAccountNeeded: true, trustExpiryDate: new Date() },
    } as any);
    tick();

    // assert
    expect(trustAccountPatchSpy).toHaveBeenCalled();
  }));

  describe('searchProduct', () => {
    it('should return empty array when no match', () => {
      // act
      const result = component.searchProduct(of('string'));

      // assert
      result.subscribe((res) => {
        expect(res).toEqual([]);
      });
    });

    it('should return arrays of match', () => {
      // act
      component.productReference = [
        {
          productName: 'test',
          productCode: 'test',
        } as any,
      ];
      const result = component.searchProduct(of('test'));

      // assert
      result.subscribe((res) => {
        expect(res.length).toEqual(1);
      });
    });

    it('should return everything when empty string', () => {
      // act
      component.productReference = [
        {
          productName: 'test',
          productCode: 'test',
        } as any,
        {
          productName: 'test2',
          productCode: 'test2',
        } as any,
      ];
      const result = component.searchProduct(of(''));

      // assert
      result.subscribe((res) => {
        expect(res.length).toEqual(2);
      });
    });
  });

  it('onCancel should ', () => {
    // arrange
    const manualSelectCancelSpy = spyOn(
      component.manualSelectProductCancel,
      'emit'
    );

    // act
    component.onCancel();

    // assert
    expect(manualSelectCancelSpy).toHaveBeenCalled();
  });

  it('getDirectDeliveryDetailsProperties should mark properties as dirty', () => {
    // act
    component.getDirectDeliveryDetailsProperties({
      directDeliveryDetails: {} as any,
      quantity: {} as any,
      isInit: false,
    });

    // assert
    expect(component.directDeliveryDetails).toEqual({} as any);
    expect(component.deliveryDetailsQty).toEqual({} as any);
    expect(component.productPropertiesFormGroup.dirty).toBeTrue();
  });

  describe('onSelect', () => {
    let expectedProduct;
    let emitNewProductSpy: jasmine.Spy;

    beforeEach(() => {
      expectedProduct = {
        expiryDate: new Date(),
        expiryScheme: ExpirySchemeTypeEnum.FixNotEndOfDay,
      } as any;
      emitNewProductSpy = spyOn(component.manualSelectProductConfirmed, 'emit');
      component.productDetailsFormGroup.patchValue(expectedProduct);
      component.selectedProduct = expectedProduct;
    });

    it('should not emit new Product', () => {
      // arrange
      component.selectedProduct = undefined;

      // act
      component.onSelect();

      // assert
      expect(emitNewProductSpy).not.toHaveBeenCalled();
    });

    it('should emit new Product', () => {
      // act
      component.onSelect();

      // assert
      expect(emitNewProductSpy).toHaveBeenCalled();
    });

    it('should emit new Product for DFV', () => {
      // arrange
      component.selectedProduct!.productType =
        ProductTypeEnum.DynamicFaceValue as any;
      component.productDetailsFormGroup.patchValue({
        expiryScheme: ExpirySchemeTypeEnum.FixEndOfDay,
      });

      // act
      component.onSelect();

      // assert
      expect(emitNewProductSpy).toHaveBeenCalled();
    });
  });

  describe('getVoucherQuantity', () => {
    it('should return voucher quantity for general product', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;

      // act
      const result = component
        .getVoucherQuantity({ voucherQuantity: 10 }, undefined);

      // assert
      expect(result).toBe(10);
    });

    it('should return dfv quantity for DFV', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;

      // act
      const result = component.getVoucherQuantity({ voucherQuantity: 10 }, [
        {
          voucherQuantity: 20,
          faceValue: 10,
        },
      ] as any);

      // assert
      expect(result).toBe(20);
    });

    it('should return delivery details quantity for Direct', () => {
      // arrange
      component.deliveryDetailsQty = { voucheryQty: 30 };
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;

      // act
      const result = component.getVoucherQuantity({ voucherQuantity: 10 }, [
        {
          voucherQuantity: 20,
          faceValue: 10,
        },
      ] as any);

      // assert
      expect(result).toBe(30);
    });
  });
});
