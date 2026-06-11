import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { TypeaheadLibComponent } from './typeahead.component';
import { TypeaheadModel } from 'projects/component-library/src/public-api';

describe('TypeaheadComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: TypeaheadLibComponent;
  let fixture: ComponentFixture<TypeaheadLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeaheadLibComponent],
      imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TypeaheadLibComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TypeaheadLibComponent);
    component = fixture.componentInstance;
    component.typeaheadModel = {
      label: 'test',
    } as TypeaheadModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('controlErrors()', () => {
    it('should return []', () => {
      // assert
      expect(component.controlErrors).toEqual([]);
    });

    it('should return errors', () => {
      // act
      component.controlDir.control?.setErrors({ required: true });

      // assert
      expect(component.controlErrors).toEqual(['required']);
    });
  });

  describe('writeValue()', () => {
    it('should set the current value', () => {
      // act
      component.writeValue('test');

      // assert
      expect(component.value).toBe('test');
    });
  });

  describe('formatter', () => {
    it('should return product name', () => {
      // act
      const result = component.formatter({ keyword: 'test' } as any);

      // assert
      expect(result).toBe('test');
    });
  });

  describe('onSelectUpdate()', () => {
    it('should set the current value', () => {
      // arrange
      const onChangedSpy = spyOn(component, 'onChange');

      // act
      component.onSelectItem(1);

      // assert
      expect(onChangedSpy).toHaveBeenCalled();
    });
  });

  describe('onTypeAheadChanged()', () => {
    it('should select item automatically', () => {
      // arrange
      const expectedItem = {
        keyword: 'test',
      } as any;
      component.typeaheadModel = {
        list: [expectedItem],
      } as any;
      component.value = 'test';

      // act
      component.onTypeAheadChanged();

      // assert
      expect(component.value).toBe(expectedItem);
    });

    it('should reset value if not existing on list', () => {
      // arrange
      const expectedItem = {
        keyword: 'test123',
      } as any;
      component.typeaheadModel = {
        list: [expectedItem],
      } as any;
      component.value = 'test';

      // act
      component.onTypeAheadChanged();

      // assert
      expect(component.value).toBeFalsy();
    });
  });

  describe('searchList', () => {
    it('should return empty array when no match', () => {
      // arrange
      component.typeaheadModel = {
        list: [
          {
            keyword: 'test',
          } as any,
        ],
      } as any;

      // act
      const result = component.searchList(of('string'));

      // assert
      result.subscribe((res) => {
        expect(res).toEqual([]);
      });
    });

    it('should return arrays of match', () => {
      // arrange
      component.typeaheadModel = {
        list: [
          {
            keyword: 'test',
          } as any,
        ],
      } as any;
      // act
      const result = component.searchList(of('test'));

      // assert
      result.subscribe((res) => {
        expect(res.length).toEqual(1);
      });
    });

    it('should return everything when empty string', () => {
      // arrange
      component.typeaheadModel = {
        list: [
          {
            keyword: 'test',
          } as any,
          {
            keyword: 'abcd',
          } as any,
        ],
      } as any;

      // act
      const result = component.searchList(of(''));

      // assert
      result.subscribe((res) => {
        expect(res.length).toEqual(2);
      });
    });
  });
});
